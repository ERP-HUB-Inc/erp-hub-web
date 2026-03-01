import React from "react";
import _ from "lodash";
import sweetalert from "sweetalert";
import Receipt from "./Receipt";
import DeliveryNote from "./DeliveryNote";
import Enum from "../../../enums";
import GeneralAction from "../../../../common/actions/general";
import TransactionAction from "../../../action/transaction/transaction";
import TransactionService from "../../../services/transactions/TransactionService";
import SalesUtil from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";
import "./Payment.css";
import ReactToPrint from "react-to-print";
import ReceiptTemplate from "../receipt/template";

export default class Payment extends Modal {
  static PAYMENT_METHOD_CREDIT_CODE = "002";
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      customerPaymentList: [],
      amountToPay: 0,
      isCustomerCredit: false,
      isAlreadyAutoPrint: false,
      isAllowPrintReceipt: false,
      isAllowPrintDeliveryNote: false,
      isNotYetPaid: true,
      isFocusOnInputBaseCurrency: true,
      validateStatus: "",
      errorMsg: "",
      formData: {},
      loadingSubmit: false,
    };
    this.paymentMethodSelectedIndex = null;
    this.wrapClassName = "pos-payment";
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1000;
    this.height = window.innerHeight < 700 ? window.innerHeight - 10 : 700;
    this.currentUser = this.getCurrentUser();
    this.handleOnMakePaymentWithCash = this.handleOnMakePaymentWithCash.bind(this);
    this.handleOnCompletePayment = this.handleOnCompletePayment.bind(this);
    this.handleOnSendMailReceipt = this.handleOnSendMailReceipt.bind(this);
    this.handleOnFocusInputAmount = this.handleOnFocusInputAmount.bind(this);
  }

  componentDidUpdate() {
    if (this.props.mail.sent) {
      this.Message.success(this.CATranslate("text_receipt_has_sent", this.props.locale));
      this.props.form.setFieldsValue({email: ""});
      document.getElementById("email").focus();
      this.props.dispatch(GeneralAction.sendMailReset());
    }

    if (
      this.props.transaction.paid
      && !this.state.isAlreadyAutoPrint) {
      let element = document.getElementById("pos-receipt-preview");
      if (element && this.state.isAllowPrintReceipt) {
        this.Util.printElemV2(element.innerHTML);
        this.setState({
          isAllowPrintReceipt: false
        });
      }

      const element2 = document.getElementById("content-receipt-and-delivery-order");
      if (element2 && this.state.isAllowPrintDeliveryNote) {
        this.Util.printElemV2(element2.innerHTML);
        this.setState({
          isAllowPrintDeliveryOrder: false
        });
      }

      this.setState({
        isAlreadyAutoPrint: true
      });
    }    
  }

  componentWillUnmount() {
    this.setState({isAlreadyAutoPrint: false});
  }

  calculateBalance(grandTotal, amountToPay) {
    const balance = grandTotal - amountToPay;
    return balance < 0 ? 0 : Math.abs(balance);
  }

  getGrandTotal() {
    const {
      summaryTotal,
      discountAmount,
      taxAmount
    } = this.props.summaryTotal;
    return  SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
  }

  getGrandTotalIncludeTax() {
    const {
      summaryTotal,
      taxAmount
    } = this.props.summaryTotal;
    return  SalesUtil.getGrandTotalWithOutDiscount(summaryTotal.subTotal, taxAmount);
  }

  getChangeAmount() {
    const totalCustomerHasGiveMoney = this.totalCustomerPaymentList();
    return totalCustomerHasGiveMoney - this.getGrandTotal();
  }

  handleOnFocusInputAmount(isFocusOnBaseCurrency) {
    if (isFocusOnBaseCurrency) {
      this.setState({isFocusOnInputBaseCurrency: true});
    } else {
      this.setState({isFocusOnInputBaseCurrency: false});
    }
  }

  handleSubmit (e) { // Here use only for protected from refresh page when hit enter while focus input payment
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
      }
    });
  }

  handleCancel() {
    this.props.handleCancel();
  }

  totalCustomerPaymentList() {
    let result = 0;
    this.state.customerPaymentList.forEach(value => {
      result += value.tender;
    });
    return result;
  }

  appendCustomerPaymentList(customerPaymentList, giveAmount, paymentMethod, balance) {
    customerPaymentList = SalesUtil.appendCustomerPaymentList(customerPaymentList, giveAmount, paymentMethod, balance);
    this.setState({customerPaymentList});
  }

  handleOnSendMailReceipt() {
    const email = this.props.form.getFieldValue("email");
    let element = document.getElementById("pos-receipt-preview");
    if (email && element) {
      element = `<html><head><title></title></head><body>${element.innerHTML}</body></html>`;
      this.props.dispatch(TransactionAction.sendEmailReceipt(element, email));
    } else {
      element = document.getElementById("email");
      if (element) {
        element.focus();
      }
    }
  }

  handleOnCompletePayment() {
    this.props.dispatch(TransactionAction.reset());
    this.setState({
      isCustomerCredit: false,
      isAlreadyAutoPrint: false,
      isNotYetPaid: true,
      customerPaymentList: [],
      amountToPay: 0
    });
    this.wrapClassName = "pos-payment";
    this.props.handleOnResetOrder();
  }

  handleOnMakePaymentWithCash(paymentMethod, paymentMethodIndex) {
    let amountToPay = this.props.form.getFieldValue("amountToPay"); // AMOUNT FROM INPUT OF CASHEIR
    let amountToPaySubCurrency = this.props.form.getFieldValue("amountToPaySubCurrency"); // AMOUNT FROM INPUT OF CASHEIR AS SUB CURRENCY
    let paymentMethodId = null;

    amountToPay = parseFloat(amountToPay);
    amountToPaySubCurrency = parseFloat(amountToPaySubCurrency);
    let grandTotal = this.getGrandTotal();
    
    // CHECK WETHER USER HAS CLICK CREDIT PAYMENT
    if (paymentMethod.code === Payment.PAYMENT_METHOD_CREDIT_CODE) {
      amountToPay = grandTotal;
      paymentMethodId = paymentMethod.id;
      this.setState({
        isCustomerCredit: true,
        isAllowPrintDeliveryNote: true
      });
    }
    
    // ADD ADDITIONAL SUB CURRENCY AMOUNT TO BASE CURRENCY VALUE
    if (!isNaN(amountToPaySubCurrency)) {
      amountToPay = amountToPay + SalesUtil.toSubCurrencyGrantTotal(amountToPaySubCurrency, this.props.subCurrency, this.props.baseCurrency);
    }

    let totalCustomerHasGiveMoney = this.totalCustomerPaymentList() + amountToPay; // previus paid + current pay of pos

    const previusBalance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney - amountToPay); // balance before get money from customer
    const balance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney);
    const {
      summaryTotal,
      discountAmount,
    } = this.props.summaryTotal;

    this.appendCustomerPaymentList(this.state.customerPaymentList, amountToPay, paymentMethod, previusBalance);

    if (totalCustomerHasGiveMoney < (grandTotal - discountAmount)) {

      this.props.form.setFieldsValue({amountToPay: 0});

      this.props.form.setFieldsValue({amountToPaySubCurrency: 0});

      this.setState({amountToPay: balance});

      document.getElementById("amountToPay").focus();

    } else {
      this.paymentMethodSelectedIndex = paymentMethodIndex;

      const dataValue = {
        customerId: this.props.customer ? this.props.customer.id : null,
        deviceNumber: this.Util.getDeviceNumber(),
        deposit: 0,
        discount: discountAmount,
        total: this.getGrandTotalIncludeTax(),
        totalExcludeTax: summaryTotal.subTotal,
        type: Enum.TRANSACTION_TYPE.RECEIPT,
        transactionEntries: this.props.productOrderList,
        paymentMethodId,
        transactionPaymentEntries: this.state.customerPaymentList
      };

      if (typeof _.sumBy(this.state.customerPaymentList, "tender") === "number") {
        this.props.dispatch(TransactionAction.add(dataValue));
        this.setState({
          isAllowPrintReceipt: this.props.form.getFieldValue("isAllowPrintReceipt"),
          amountToPay
        });
      } else {
        sweetalert({
          icon: "error",
          title: this.CATranslate("text_invalid_tender_amount", this.props.locale),
          text: `
            You can try to re-enter tender amount again
          `,
          buttons: [false, this.CATranslate("text_close", this.props.locale)],
          dangerMode: true
        });
      }
    }
  }

  async handleSubmitPayment(paymentMethod, paymentMethodIndex) {
    const values = this.props.form.getFieldsValue();
    let amountToPay = values.amountToPay;
    let amountToPaySubCurrency = values.amountToPaySubCurrency;
    let paymentMethodId = null;
    amountToPay = parseFloat(amountToPay);
    amountToPaySubCurrency = parseFloat(amountToPaySubCurrency);
    let grandTotal = this.getGrandTotal();

    // CHECK WETHER USER HAS CLICK CREDIT PAYMENT
    if (paymentMethod.code === Payment.PAYMENT_METHOD_CREDIT_CODE) {
      amountToPay = grandTotal;
      paymentMethodId = paymentMethod.id;
      this.setState({
        isCustomerCredit: true,
        isAllowPrintDeliveryNote: true
      });
    }

    if (!isNaN(amountToPaySubCurrency)) {
      amountToPay = amountToPay + SalesUtil.toSubCurrencyGrantTotal(amountToPaySubCurrency, this.props.subCurrency, this.props.baseCurrency);
    }

    let totalCustomerHasGiveMoney = this.totalCustomerPaymentList() + amountToPay; 
    const previousBalance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney - amountToPay); // balance before get money from customer
    const balance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney);
    const {
      summaryTotal,
      discountAmount,
    } = this.props.summaryTotal;

    this.appendCustomerPaymentList(this.state.customerPaymentList, amountToPay, paymentMethod, previousBalance);

    if (totalCustomerHasGiveMoney < (grandTotal - discountAmount)) {
      this.props.form.setFieldsValue({amountToPay: 0});

      this.props.form.setFieldsValue({amountToPaySubCurrency: 0});

      this.setState({
        amountToPay: balance,
        isAllowPrintReceipt: false
      });

      document.getElementById("amountToPay").focus();
      return false;
    } else {
      this.paymentMethodSelectedIndex = paymentMethodIndex;

      const dataValue = {
        customerId: this.props.customer ? this.props.customer.id : null,
        deviceNumber: this.Util.getDeviceNumber(),
        deposit: 0,
        discount: discountAmount,
        total: this.getGrandTotalIncludeTax(),
        totalExcludeTax: summaryTotal.subTotal,
        type: Enum.TRANSACTION_TYPE.RECEIPT,
        transactionEntries: this.props.productOrderList,
        paymentMethodId,
        transactionPaymentEntries: this.state.customerPaymentList
      };

      if (typeof _.sumBy(this.state.customerPaymentList, "tender") === "number") {
        this.setState({loadingSubmit: true});
        try {
          const response = (await TransactionService.add(dataValue)).data.data;
          if (response) {
            response.receiptTemplate = 2;
            this.setState({
              formData: response,
              loadingSubmit: false,
              isAllowPrintDeliveryOrder: values.isAllowPrintReceipt,
              amountToPay,
              isCustomerCredit: false,
              isAlreadyAutoPrint: false,
              customerPaymentList: []
            });

            if (!values.isAllowPrintReceipt) {
              this.setState({isNotYetPaid: false});
            } else {
              this.setState({isAllowPrintReceipt: true});
            }
          }
        } catch (err) {
          return false;
        } finally {
          this.setState({submitLoading: false});
        }
      }
    }
  }

  renderMoneyExhangeAfterPay(balance, changeAmount) {
    if (this.state.customerPaymentList.length <= 0) {
      return [];
    } else {
      return [
        this.state.customerPaymentList.map((payment, paymentIndex) =>
          <li key={paymentIndex}>
            <div className="sub-total-title">
              {payment.paymentMethodName}
            </div>
            <div className="sub-total-value">
              {this.formatCurrency(payment.tender)}
            </div>
          </li>),
        changeAmount > 0 ?
          <li key="a">
            <div className="sub-total-title">
              <this.Translate id="text_change"/>
            </div>
            <div className="sub-total-value">
              {this.formatCurrency(changeAmount)}
            </div>
          </li>
          :
          "",
        <li key="b">
          <div className="text-uppercase grand-total-title">
            <this.Translate id="text_balance"/>
          </div>
          <div className="grand-total-value">
            {this.formatCurrency(balance)}
          </div>
        </li>
      ];
    }
  }

  renderCrudAction() {
  }

  renderCustomerInfo() {
    return <div className="customer-credit-info">
      <div className="inner-customer-credit-info">
        <div className="customer-info-title"><this.Translate id="text_customer_info" /></div>
        <div className="data-row" style={{ lineHeight: 1, marginBottom: 10 }}>
          <div>
            {`${this.props.customer.firstName} ${this.props.customer.lastName}`}
          </div>
          <div style={{ fontSize: "10pt" }}>{this.props.customer.phoneNumber}</div>
        </div>
        <div className="data-row" style={{ display: "flex", alignItems: "center" }}>
          <div>
            {<this.Translate id="text_credit_balance" />}:
          </div>
          <div style={{ fontSize: "16pt", fontFamily: "serif", paddingLeft: 10 }}>
            {this.formatCurrency(this.props.customer.credit ? this.props.customer.credit : 0)}
          </div>
        </div>
      </div>
    </div>;
  }

  render() {
    const {
      summaryTotal,
      taxRate,
      discountAmount,
      taxAmount,
      discountTypeStr
    } = this.props.summaryTotal;

    const {
      taxTitle,
      countTax
    } = this.props.summaryTax;

    const grandTotal = this.getGrandTotal();
    const changeAmount = this.getChangeAmount();
    const totalCustomerHasGiveMoney = this.totalCustomerPaymentList();

    const balance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney);
    
    let paymentMethodList = [];
    if (this.props.paymentMethodList) {
      paymentMethodList = this.Util.chuckCollection(this.props.paymentMethodList.list.filter(paymentMethod => paymentMethod.code !== Payment.PAYMENT_METHOD_CREDIT_CODE), 2);
    }

    if (this.props.transaction.paid) {
      this.wrapClassName += " pos-payment-paid"; //hidden close modal
    }

    if (this.props.transaction.showForm) {
      let dataForReceipt = {};

      if (this.props.transaction.response) {
        let {
          total,
          discount
        } = this.props.transaction.response.data;

        summaryTotal.subTotalAfterDiscount = total - discount;

        dataForReceipt = {
          data: this.props.transaction.response.data,
          receiptTemplate: this.props.receiptTemplate.data,
          currentUser: this.currentUser,
          customerPaymentList: this.state.customerPaymentList,
          customer: this.props.customer,
          isCustomerCredit: this.state.isCustomerCredit,
          productList: this.props.productOrderList,
          customerFieldPrice: this.props.customerFieldPrice,
          productTaxList: this.props.productTaxList,
          summaryTotal,
          summaryTax: this.props.summaryTax,
          grandTotal,
          changeAmount,
          taxRate,
          taxAmount,
          discountAmount
        };
      }

      const printProps = {
        content: () => this.receiptRef,
        onAfterPrint: () => this.setState({isNotYetPaid: false}),
      };

      if (!this.state.isAllowPrintReceipt) {
        printProps.print = () => {
          return false;
        };
      }

      this.content = (
        <this.Row>
          {
            this.props.transaction.response ?
              <div style={{display: "none"}} id="content-receipt-and-delivery-order">
                <Receipt {...dataForReceipt} />
                {
                  this.state.isAllowPrintDeliveryNote ?
                    <DeliveryNote {...dataForReceipt} />
                    :
                    ""
                }
              </div>
              :
              ""
          }
          <this.Col md="5" className="sale-summary">
            <div className="title"><this.Translate id="text_sale_summary"/></div>
            <div className="list-order-summary">
              <ul className="list-unstyled">
                {
                  this.props.productOrderList.map((productOrder, productOrderIndex) => 
                    <li key={productOrderIndex}>
                      <div className="title">
                        {productOrder.name}
                        {
                          productOrder.variantName ?
                            <div className="variant-name">{productOrder.variantName}</div>
                            :
                            ""
                        }
                      </div>
                      <div className="quantity">{productOrder.quantity}x</div>
                      <div className="price">
                        {
                          productOrder.discount > 0 ?
                            <div className="after-discount-price">
                              {this.formatCurrency(SalesUtil.getTotalAmountAfterDiscount(productOrder.quantity,  productOrder[this.props.customerFieldPrice], productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.formatCurrency(SalesUtil.getTotalAmount(productOrder.quantity, productOrder[this.props.customerFieldPrice]))}
                        </div>
                      </div>
                    </li>   
                  )
                }
              </ul>
            </div>
            <ul className="list-unstyled ca-penel-v1 total-order-summary">
              <li>
                <div className="sub-total-title">
                  <this.Translate id="text_sub_total" />
                </div>
                <div className="sub-total-value">
                  {this.formatCurrency(summaryTotal.subTotalAfterDiscount)}
                </div>
              </li>
              <li>
                <div className="sub-total-title">
                  <this.Translate id="text_tax"/> {taxTitle}
                </div>
                <div className="sub-total-value">
                  {this.formatCurrency(taxAmount)}
                </div>
              </li>
              {
                countTax > 1 ?
                  this.props.productTaxList.map((productTax, productTaxIndex) => 
                    <li key={productTaxIndex} className="tax-item">
                      <div className="sub-total-title">
                        {productTax.name}
                      </div>
                      <div className="sub-total-value">
                        {this.formatCurrency(productTax.totalTaxAmount)}
                      </div>
                    </li>
                  )
                  :
                  ""
              }
              {
                discountAmount > 0 ?
                  <li>
                    <div className="sub-total-title">
                      <this.Translate id="text_discount"/>
                      {discountTypeStr}
                    </div>
                    <div className="sub-total-value">
                      {this.formatCurrency(discountAmount)}
                    </div>
                  </li>
                  :
                  ""
              }
            </ul>
            <ul className="list-unstyled ca-penel-v1 grand-total">
              <li>
                <div className="wrap-grand-total-title">
                  <div className="text-uppercase grand-total-title">
                    <this.Translate id="text_total"/>
                  </div>
                  <div className="total-quantity">{this.props.productOrderList.length} {summaryTotal.totalQuantity > 1 ? <this.Translate id="text_items"/> : <this.Translate id="text_item"/>}</div>
                </div>
                <div className="grand-total-value">
                  {this.formatCurrency(grandTotal)}
                </div>
              </li>
              {this.renderMoneyExhangeAfterPay(balance, changeAmount).map(element => element)}
            </ul>
          </this.Col>
          <this.Col md="7" className="wrap-payment-tool">
            {
              // this.totalCustomerPaymentList() < grandTotal && !this.props.transaction.paid ?
              this.state.isNotYetPaid ?
                <div className="payment-tool">
                  <div className="total-display">
                    <div className="title-total-display">
                      <this.Translate id="text_amount_to_pay" />:
                    </div>
                    <div className="value-total-display">
                      {
                        this.state.isFocusOnInputBaseCurrency ?
                          this.formatCurrency(balance)
                          :
                          this.Util.formatCurrency(SalesUtil.toSubCurrencyGrantTotal(balance, this.props.baseCurrency, this.props.subCurrency), this.props.subCurrency.symbol)
                      }
                    </div>
                  </div>
                  <div className="amount-to-pay">
                    {/* <div className="title">
                      <this.Translate id="text_pay"/>
                    </div> */}
                    <div className="currency-symbol-payment">
                      <div>
                        {this.Util.getSetting() ? this.Util.getSetting().currency : "ERROR"}
                      </div>
                    </div>
                    <this.InputNumber
                      name="amountToPay"
                      className="ca-input-v1 text-right"
                      isHideTool={true}
                      isAutoFocus={true}
                      isAutoSelect={true}
                      validateStatus={this.state.validateStatus}
                      errorMsg={this.state.errorMsg}
                      // data={grandTotal}
                      form={this.props.form}
                      handleOnFocus={() => this.handleOnFocusInputAmount(true)} />
                  </div>
                  {
                    this.props.isHasSubCurrency ?
                      <div className="amount-to-pay" style={{marginTop: 10}}>
                        <div className="currency-symbol-payment">
                          <div>
                            {this.props.subCurrency ? this.props.subCurrency.symbol : "ERROR"}
                          </div>
                        </div>
                        <this.InputNumber
                          name="amountToPaySubCurrency"
                          className="ca-input-v1 text-right"
                          isHideTool={true}
                          isAutoSelect={true}
                          validateStatus={this.state.validateStatus}
                          errorMsg={this.state.errorMsg}
                          form={this.props.form}
                          handleOnFocus={() => this.handleOnFocusInputAmount(false)}
                          handleOnBlur={() => this.handleOnFocusInputAmount(true)} />
                      </div>
                      :
                      ""
                  }
                  <div className="action-button-to-pay">
                    <this.Checkboxs
                      name="isAllowPrintReceipt"
                      defaultValue={true}
                      label={<this.Translate id="text_print_receipt" />}
                      form={this.props.form} />
                    {
                      paymentMethodList.map((paymentMethodListChild, index1) =>
                        paymentMethodListChild.map((paymentMethod, index2) =>
                          <ReactToPrint 
                            key={parseInt(`${index1}${index2}`, 10)} // duplicate key index of loop
                            onBeforeGetContent={() => this.handleSubmitPayment(paymentMethod, parseInt(`${index1}${index2}`, 10))}
                            trigger={() => {
                              return <this.Button
                                type="info"
                                className={index2 === 0 && paymentMethodListChild.length > 1 ? "mg-right" : ""}
                                width="308px"
                                htmlType="submit"
                                loading={this.state.loadingSubmit}
                              >
                                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                  <img src={this.Util.getGeneralImage("storeVein/cash-payment-method.svg").url} alt="cash" style={{width: 40, marginRight: 15}} />
                                  <div>{paymentMethod.name}</div>
                                </div>
                              </this.Button>;
                            }}
                            {...printProps} 
                          />
                        ) 
                      )
                    }
                  </div>
                  {
                    this.props.customer ?
                      <div className="wrap-customer-credit-info">
                        <div style={{ border: "0.5px solid #d9d9d9" }} />
                        <div className="separate-title-line">
                          <this.Translate id="text_or_pay_later" />
                        </div>
                        {this.renderCustomerInfo()}
                        <div className="action-button-to-pay">
                          {
                            this.props.paymentMethodList.list.filter(paymentMethod => paymentMethod.code === Payment.PAYMENT_METHOD_CREDIT_CODE).map(paymentMethod => 
                              <this.Button
                                htmlType="submit"
                                key={Payment.PAYMENT_METHOD_CREDIT_CODE} // duplicate key index of loop
                                loading={this.paymentMethodSelectedIndex === Payment.PAYMENT_METHOD_CREDIT_CODE && this.props.transaction.paying}
                                type="info"
                                width="308px"
                                onClick={() => this.handleOnMakePaymentWithCash(paymentMethod, Payment.PAYMENT_METHOD_CREDIT_CODE)}>
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
                                  <img src={this.Util.getGeneralImage("storeVein/credit-note.svg").url} alt="cash" style={{ width: 50, marginRight: 15 }} />
                                  <div>{paymentMethod.name}</div>
                                </div>
                              </this.Button> 
                            )
                          }
                        </div>
                      </div>
                      :
                      ""
                  }
                </div>
                :
                <div className="confirm-payment">
                  {
                    this.state.isCustomerCredit ?
                      <div style={{marginBottom: 30}}>
                        <div className="text-center title">
                          <span>
                            {this.formatCurrency(grandTotal)} <this.Translate id="text_info_for_customer_credit" />
                          </span>
                        </div>
                        {this.renderCustomerInfo()}
                      </div>
                      :
                      <div className="text-center title">
                        {
                          changeAmount > 0 ?
                            <span>
                              <this.Translate id="text_give" /> {this.formatCurrency(changeAmount)} <this.Translate id="text_change" />
                            </span>
                            :
                            <span>
                              <this.Translate id="text_payment" /> <this.Translate id="text_received" />
                            </span>
                        }
                      </div>
                  }
                  <div className="wrap-email-receipt">
                    <this.InputEmail
                      name="email"
                      className="ca-input-v1"
                      placeholder={this.CATranslate("text_email", this.props.locale)}
                      form={this.props.form}/>
                    <this.Button loading={this.props.mail.sending} type="info" className="margin-left-8 ca-button-v1 btn-send-email-receipt" onClick={this.handleOnSendMailReceipt}>
                      <this.Translate id="text_email_receipt" />
                    </this.Button>
                  </div>
                  <div className="complete-action">
                    <this.Button type="info" className="ca-button-v1 btn-send-email-receipt" onClick={this.handleOnCompletePayment}>
                      <this.Translate id="text_done" /> (ESC)
                    </this.Button>
                  </div>
                </div>
            }
          </this.Col>

          <div style={{display: "none"}}>
            <ReceiptTemplate 
              ref={re => this.receiptRef = re}
              formData={this.state.formData}
              receiptTemplate={this.props.receiptTemplate.data}
              currentUser={this.currentUser}
              customerPaymentList={this.state.customerPaymentList}
              customer={this.props.customer}
              isCustomerCredit={this.state.isCustomerCredit}
              productList={this.props.productOrderList}
              customerFieldPrice={this.props.customerFieldPrice}
              productTaxList={this.props.productTaxList}
            />
          </div>
        </this.Row>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}

Payment.defaultProps = {
  productOrderList: [],
  customerFieldPrice: "price"
};