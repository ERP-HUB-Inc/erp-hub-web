import React from "react";
import * as jsPDF from "jspdf";
import Receipt from "./Receipt";
import Enum from "../../../enums";
import TransactionAction from "../../../action/transaction/transaction";
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
      isNotYetPaid: true,
      validateStatus: "",
      errorMsg: ""
    };
    this.wrapClassName = "pos-payment";
    this.width = "70%";
    this.currentUser = this.getCurrentUser();
    this.handleOnMakePaymentWithCash = this.handleOnMakePaymentWithCash.bind(this);
    this.handleOnCompletePayment = this.handleOnCompletePayment.bind(this);
    this.handleOnSendMailReceipt = this.handleOnSendMailReceipt.bind(this);
  }

  renderCrudAction() {
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
    if (customerPaymentList.length === 0) {
      customerPaymentList.push({
        tender: giveAmount,
        balance,
        change: 0,
        paymentMethodName: paymentMethod.name,
        paymentMethodId: paymentMethod.id
      });
    } else {
      let isNotTheSame = true;
      customerPaymentList.forEach((payment, index) => {
        if (payment.paymentMethodId === paymentMethod.id) {
          isNotTheSame = false;
          customerPaymentList[index]["tender"] += giveAmount;
        }
      });

      if (isNotTheSame) {
        customerPaymentList.push({
          tender: giveAmount,
          balance,
          change: 0,
          paymentMethodName: paymentMethod.name,
          paymentMethodId: paymentMethod.id
        });
      }
    }

    this.setState({customerPaymentList});
  }

  handleOnSendMailReceipt() {
    const email = this.props.form.getFieldValue("email");
    let element = document.getElementById("pos-receipt-preview").innerHTML;
    element = `<html><head><title></title></head><body>${element}</body></html>`;
    this.props.dispatch(TransactionAction.sendEmailReceipt(element, email));
  }

  handleOnCompletePayment() {
    if (this.props.transaction.paid) {
      const element = document.getElementById("pos-receipt-preview");
      if (element) {
        this.Util.printElem(element.innerHTML);
        this.props.dispatch(TransactionAction.reset());
        this.setState({
          isNotYetPaid: false,
          customerPaymentList: [],
          amountToPay: 0
        });
        this.props.handleOnResetOrder();
      }
    }
  }

  handleOnMakePaymentWithCash(paymentMethod) {
    this.wrapClassName += " pos-payment-paid";
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
      const {
        summaryTotal,
        discountAmount,
      } = this.props.summaryTotal;

      const dataValue = {
        paymentMethodId: paymentMethod.id,
        exchangeRate: 0,
        deposit: 0,
        discount: discountAmount,
        total: grandTotal,
        totalExcludeTax: summaryTotal.subTotalAfterDiscount,
        type: Enum.TRANSACTION_TYPE.RECEIPT,
        transactionEntries: this.props.productOrderList,
        transactionPaymentEntries: this.state.customerPaymentList
      };

      // console.log("Payment Values:", dataValue);
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
              {this.Util.formatCurrency(payment.tender)}
            </div>
          </li>),
        changeAmount > 0 ?
          <li key="a">
            <div className="sub-total-title">
              <this.Translate id="text_change"/>
            </div>
            <div className="sub-total-value">
              {this.Util.formatCurrency(changeAmount)}
            </div>
          </li>
          :
          "",
        <li key="b">
          <div className="text-uppercase grand-total-title">
            <this.Translate id="text_balance"/>
          </div>
          <div className="grand-total-value">
            {this.Util.formatCurrency(balance)}
          </div>
        </li>
      ];
    }
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

  getChangeAmount() {
    const totalCustomerHasGiveMoney = this.totalCustomerPaymentList();
    return totalCustomerHasGiveMoney - this.getGrandTotal();
  }

  render() {
    const {
      summaryTotal,
      taxRate,
      discountAmount,
      taxAmount,
      discountType,
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
      paymentMethodList = this.props.paymentMethodList.list;
    }

    if (this.props.transaction.showForm) {
      this.content = (
        <this.Row>
          {
            this.props.transaction.response ?
              <Receipt
                data={this.props.transaction.response.data}
                currentUser={this.currentUser}
                customerPaymentList={this.state.customerPaymentList}
                paymentMethodList={paymentMethodList}
                productList={this.props.productOrderList}
                productTaxList={this.props.productTaxList}
                summaryTotal={summaryTotal}
                summaryTax={this.props.summaryTax}
                grandTotal={grandTotal}
                changeAmount={changeAmount}
                taxRate={taxRate}
                taxAmount={taxAmount}
                discountType={discountType}
                discountTypeStr={discountTypeStr}
                discountAmount={discountAmount} />
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
                              {this.Util.formatCurrency(POSUtil.getTotalAmountAfterDiscount(productOrder.quantity,  productOrder.price, productOrder.discount))}
                            </div>
                            :
                            ""
                        }
                        <div className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}>
                          {this.Util.formatCurrency(POSUtil.getTotalAmount(productOrder.quantity, productOrder.price))}
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
                  {this.Util.formatCurrency(summaryTotal.subTotalAfterDiscount)}
                </div>
              </li>
              {
                discountAmount > 0 ?
                  <li>
                    <div className="sub-total-title">
                      <this.Translate id="text_discount"/>
                      {discountTypeStr}
                    </div>
                    <div className="sub-total-value">
                      {this.Util.formatCurrency(discountAmount)}
                    </div>
                  </li>
                  :
                  ""
              }
              <li>
                <div className="sub-total-title">
                  <this.Translate id="text_tax"/> {taxTitle}
                </div>
                <div className="sub-total-value">
                  {this.Util.formatCurrency(taxAmount)}
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
                        {this.Util.formatCurrency(productTax.totalTaxAmount)}
                      </div>
                    </li>
                  )
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
                  <div className="total-quantity">{summaryTotal.totalQuantity} <this.Translate id="text_item"/>{summaryTotal.totalQuantity > 1 ? <this.Translate id="text_plural"/> : ""}</div>
                </div>
                <div className="grand-total-value">
                  {this.Util.formatCurrency(grandTotal)}
                </div>
              </li>
              {this.renderMoneyExhangeAfterPay(balance, changeAmount).map(element => element)}
            </ul>
          </this.Col>
          <this.Col md="7" className="wrap-payment-tool">
            {
              this.totalCustomerPaymentList() < grandTotal ?
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
                      paymentMethodList.map((paymentMethod, paymentMethodIndex) =>
                        <this.Button key={paymentMethodIndex} type="info" className="mg-right" onClick={() => this.handleOnMakePaymentWithCash(paymentMethod)}>
                          {paymentMethod.name}
                        </this.Button> 
                      )
                    }
                    {/* <this.Button type="info" onClick={this.handleOnMakePayment}>
                      <this.Translate id="text_credit_card" />
                    </this.Button> */}
                  </div>
                </div>
                :
                <div className="text-center confirm-payment">
                  <div className="title">
                    {
                      changeAmount > 0 ?
                        <span>
                          <this.Translate id="text_give"/> {this.Util.formatCurrency(changeAmount)} <this.Translate id="text_change"/>
                        </span>
                        :
                        <span>
                          <this.Translate id="text_payment"/> <this.Translate id="text_received"/>
                        </span>
                    }
                  </div>
                  <div className="wrap-email-receipt">
                    <this.InputText
                      name="email"
                      className="ca-input-v1"
                      placeholder="Email address"
                      form={this.props.form}/>
                    <this.Button type="info" className="margin-left-8 ca-button-v1 btn-send-email-receipt" onClick={this.handleOnSendMailReceipt}>
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