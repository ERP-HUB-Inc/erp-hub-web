import React from "react";
import Receipt from "./Receipt";
import Enum from "../../../enums";
import GeneralAction from "../../../../common/actions/general";
import TransactionAction from "../../../action/transaction/transaction";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import POSUtil from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";
import "./Payment.css";

export default class Payment extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      customerPaymentList: [],
      amountToPay: 0,
      isAlreadyAutoPrint: false,
      isNotYetPaid: true,
      validateStatus: "",
      errorMsg: ""
    };
    this.paymentMethodSelectedIndex = null;
    this.wrapClassName = "pos-payment";
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1000;
    this.height = window.innerHeight < 700 ? window.innerHeight - 10 : 700;
    this.currentUser = this.getCurrentUser();
    this.handleOnMakePaymentWithCash = this.handleOnMakePaymentWithCash.bind(this);
    this.handleOnCompletePayment = this.handleOnCompletePayment.bind(this);
    this.handleOnSendMailReceipt = this.handleOnSendMailReceipt.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(ReceiptTemplateAction.default());
  }

  componentDidUpdate() {
    if (this.props.mail.sent) {
      this.Message.success(this.CATranslate("text_receipt_has_sent", this.props.locale));
      this.props.form.setFieldsValue({email: ""});
      document.getElementById("email").focus();
      this.props.dispatch(GeneralAction.sendMailReset());
    }

    if (this.props.transaction.paid && !this.state.isAlreadyAutoPrint) {
      const element = document.getElementById("pos-receipt-preview");
      if (element) {
        this.Util.printElemV2(element.innerHTML);
        this.setState({isAlreadyAutoPrint: true});
      }
    }
  }

  componentWillUnmount() {
    this.setState({isAlreadyAutoPrint: false});
  }

  handleSubmit (e) { // Here use only for protected from refresh page when hit enter while focus input payment
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
      }
    });
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
    return  POSUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
  }

  getGrandTotalWithOutDiscount() {
    const {
      summaryTotal,
      taxAmount
    } = this.props.summaryTotal;
    return  POSUtil.getGrandTotalWithOutDiscount(summaryTotal.subTotal, taxAmount);
  }

  getChangeAmount() {
    const totalCustomerHasGiveMoney = this.totalCustomerPaymentList();
    return totalCustomerHasGiveMoney - this.getGrandTotal();
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
    customerPaymentList = POSUtil.appendCustomerPaymentList(customerPaymentList, giveAmount, paymentMethod, balance);
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
    if (this.props.transaction.paid && this.state.isNotYetPaid) {
      this.props.dispatch(TransactionAction.reset());
      this.setState({
        isAlreadyAutoPrint: false,
        isNotYetPaid: true,
        customerPaymentList: [],
        amountToPay: 0
      });
      this.props.handleOnResetOrder();
    }
  }

  handleOnMakePaymentWithCash(paymentMethod, paymentMethodIndex) {
    let amountToPay = this.props.form.getFieldValue("amountToPay"); // AMOUNT FROM INPUT OF CASHEIR
    amountToPay = parseFloat(amountToPay);

    let grandTotal = this.getGrandTotal();
    let totalCustomerHasGiveMoney = this.totalCustomerPaymentList() + amountToPay; // previus paid + current pay of pos

    const previusBalance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney - amountToPay); // balance before get money from customer
    const balance = this.calculateBalance(grandTotal, totalCustomerHasGiveMoney);

    this.appendCustomerPaymentList(this.state.customerPaymentList, amountToPay, paymentMethod, previusBalance);

    if (totalCustomerHasGiveMoney < grandTotal) {

      this.props.form.setFieldsValue({amountToPay: balance});

      this.setState({amountToPay: balance});

      document.getElementById("amountToPay").focus();

    } else {
      this.paymentMethodSelectedIndex = paymentMethodIndex;

      const {
        summaryTotal,
        discountAmount,
      } = this.props.summaryTotal;

      const dataValue = {
        deviceNumber: this.Util.getDeviceNumber(),
        exchangeRate: 0,
        deposit: 0,
        discount: discountAmount,
        total: this.getGrandTotalWithOutDiscount(),
        totalExcludeTax: summaryTotal.subTotalAfterDiscount,
        type: Enum.TRANSACTION_TYPE.RECEIPT,
        transactionEntries: this.props.productOrderList,
        transactionPaymentEntries: this.state.customerPaymentList
      };

      this.props.dispatch(TransactionAction.add(dataValue));
      this.setState({
        amountToPay
      });
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
      paymentMethodList = this.Util.chuckCollection(this.props.paymentMethodList.list, 2);
    }

    if (this.props.transaction.paid) {
      this.wrapClassName += " pos-payment-paid"; //hidden close modal
    }

    if (this.props.transaction.showForm) {
      this.content = (
        <this.Row>
          {
            this.props.transaction.response ?
              <div style={{display: "none"}}>
                <Receipt
                  data={this.props.transaction.response.data}
                  receiptTemplate={this.props.receiptTemplate.data}
                  currentUser={this.currentUser}
                  customerPaymentList={this.state.customerPaymentList}
                  productList={this.props.productOrderList}
                  productTaxList={this.props.productTaxList}
                  summaryTotal={summaryTotal}
                  summaryTax={this.props.summaryTax}
                  grandTotal={grandTotal}
                  changeAmount={changeAmount}
                  taxRate={taxRate}
                  taxAmount={taxAmount}
                  discountAmount={discountAmount} />
              </div>
              :
              ""
          }
          <this.Col md="5" className="sale-summary">
            <div className="title text-uppercase"><this.Translate id="text_sale_summary"/></div>
            <div className="list-order-summary">
              <ul className="list-unstyled">
                {
                  this.props.productOrderList.map((productOrder, productOrderIndex) => 
                    <li key={productOrderIndex}>
                      <div className="title">{productOrder.name}</div>
                      <div className="quantity">{productOrder.quantity}x</div>
                      <div className="price">
                        {
                          productOrder.discount > 0 ?
                            <div className="after-discount-price">
                              {this.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity,  productOrder.price, productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder.price))}
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
                  <div className="total-quantity">{summaryTotal.totalQuantity} {summaryTotal.totalQuantity > 1 ? <this.Translate id="text_items"/> : <this.Translate id="text_item"/>}</div>
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
              !this.props.transaction.paid ?
                <div className="payment-tool">
                  <div className="amount-to-pay">
                    <div className="title"><this.Translate id="text_pay"/></div>
                    <this.InputNumber
                      name="amountToPay"
                      className="ca-input-v1 text-right"
                      isHideTool={true}
                      isAutoFocus={true}
                      isAutoSelect={true}
                      validateStatus={this.state.validateStatus}
                      errorMsg={this.state.errorMsg}
                      data={grandTotal}
                      form={this.props.form}/>
                  </div>
                  <div className="action-button-to-pay">
                    {
                      paymentMethodList.map((paymentMethodListChild, index1) =>
                        paymentMethodListChild.map((paymentMethod, index2) => 
                          <this.Button
                            htmlType="submit"
                            key={parseInt(`${index1}${index2}`, 10)} // duplicate key index of loop
                            loading={this.paymentMethodSelectedIndex === parseInt(`${index1}${index2}`, 10) && this.props.transaction.paying} 
                            type="info"
                            className={index2 === 0 && paymentMethodListChild.length > 1 ? "mg-right" : ""}
                            width={`${(100/paymentMethodListChild.length)-1}%`}
                            onClick={() => this.handleOnMakePaymentWithCash(paymentMethod, parseInt(`${index1}${index2}`, 10))}>
                            {paymentMethod.name}
                          </this.Button>
                        ) 
                      )
                    }
                  </div>
                </div>
                :
                <div className="confirm-payment">
                  <div className="text-center title">
                    {
                      changeAmount > 0 ?
                        <span>
                          <this.Translate id="text_give"/> {this.formatCurrency(changeAmount)} <this.Translate id="text_change"/>
                        </span>
                        :
                        <span>
                          <this.Translate id="text_payment"/> <this.Translate id="text_received"/>
                        </span>
                    }
                  </div>
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
        </this.Row>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}

Payment.defaultProps = {
  productOrderList: []
};