import React from "react";
import _ from "lodash";
import sweetalert from "sweetalert";
import { 
  Button, 
  Checkbox, 
  Col, 
  Drawer, 
  Form, 
  InputNumber, 
  Row, 
  Tooltip
} from "antd";
import Receipt from "./Receipt";
import "./payment.css";
import RetailSaleService from "@services/RetailSaleService";
import GeneralAction from "../../../../common/actions/general";
import TransactionAction from "../../../action/transaction/transaction";
import SalesUtil from "../../../utils";
import Modal from "../../../../common/components/shares/Modal";
import ReceiptV2 from "./receipt-v2";
import QuickCash from "./quick.cash";
import PaymentSummary from "./payment.summary";
import { convertKHRToUSD, convertUSDToKHR } from "@helper/index";

export default class PaymentScreen extends Modal {
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
      isNotYetPaid: true,
      isFocusOnInputBaseCurrency: true,
      validateStatus: "",
      errorMsg: "",
      tenderInputFocus: "KHR",
      formData: {},
      loadingSubmit: false,
      submittingPayment: false,
    };
    this.paymentMethodSelectedIndex = null;
    this.wrapClassName = "pos-payment";
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1000;
    this.height = window.innerHeight < 700 ? window.innerHeight - 10 : 700;
    this.currentUser = this.getCurrentUser();
    this.khrInputRef = React.createRef();
    this.quickCashRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.khrInputRef.current) {
        this.khrInputRef.current.focus();
      }
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (this.props.mail.sent) {
      this.Message.success(this.CATranslate("text_receipt_has_sent", this.props.locale));
      this.props.form.setFieldsValue({ email: "" });
      document.getElementById("email").focus();
      this.props.dispatch(GeneralAction.sendMailReset());
    }

    if (this.props.transaction.paid && !this.state.isAlreadyAutoPrint) {
      let element = document.getElementById("pos-receipt-preview");
      if (element && this.state.isAllowPrintReceipt) {
        this.Util.printElemV2(element.innerHTML);
        this.setState({
          isAllowPrintReceipt: false,
        });
      }

      this.setState({
        isAlreadyAutoPrint: true,
      });
    }

    // When payment screen becomes visible
    if (!prevProps.paymentVisible && this.props.paymentVisible) {
      window.addEventListener("keydown", this.handleGlobalKeyDown);
    }

    // When payment screen becomes hidden
    if (prevProps.paymentVisible && !this.props.paymentVisible) {
      window.removeEventListener("keydown", this.handleGlobalKeyDown);
    }
  }

  componentWillUnmount() {
    this.setState({ isAlreadyAutoPrint: false });
    window.removeEventListener("keydown", this.handleGlobalKeyDown);
  }

  formatCurrency(props = { value: 0, currency: "", position: 0, showSymbol: true }) {
    let { value, currency, position, showSymbol } = props;
    let temp = value;
    const currentSetting = this.Util.getSetting();
    if (currentSetting && !currency) {
      currency = currentSetting.currency;
      position = currentSetting.currencyPosition;
    }

    showSymbol = true;

    // DETECT DONT WANT TO SHOW CURRENCY SYMBOL
    if (!showSymbol) {
      currency = "";
    }

    temp = this.Util.formatCurrency(Math.abs(temp), currency, position);
    return value < 0 ? `(${temp})` : temp;
  }

  mapFreeProductsToOrder() {
    let items = [];
    this.props.orderItems.forEach((item) => {
      const orderItem = {
        ...item,
        categoryId: item.categoryId ? item.categoryId : null,
        unitPrice: item.newPrice,
        addons: [],
      };

      items.push(orderItem);

      if (Array.isArray(item.freeProducts)) {
        items = items.concat(item.freeProducts);
        delete item.freeProducts;
      }
    });

    return items;
  }

  handleGlobalKeyDown = (e) => {
    if (!this.props.paymentVisible) return;

    const allowedControlKeys = ["Backspace", "Delete", "Enter"];

    // Handle numbers
    if (e.key >= "0" && e.key <= "9") {
      if (this.state.tenderInputFocus === "KHR") {
        const tenderInCashKHR = (this.props.form.getFieldValue("tenderInCashKHR") || 0) + e.key;
        this.props.form.setFieldsValue({ tenderInCashKHR });
      }
      return;
    }

    // Handle decimal
    if (e.key === ".") {
      return;
    }

    // Handle backspace
    if (e.key === "Backspace") {
      if (this.state.tenderInputFocus === "USD") {
        let tenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || "";
        tenderInCashUSD = tenderInCashUSD.toString().slice(0, -1);
        this.props.form.setFieldsValue({
          tenderInCashUSD,
        });
      } else {
        let tenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || "";
        tenderInCashKHR = tenderInCashKHR.toString().slice(0, -1);
        this.props.form.setFieldsValue({
          tenderInCashKHR,
        });
      }

      return;
    }

    // Handle Enter (confirm payment)
    if (e.key === "Enter") {
      this.handleOnMakePayment();
      return;
    }

    if (e.key === "F5") {
      e.preventDefault();
      this.props.form.resetFields();
    }
  };

  getTotalTenderUSD() {
    const tenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
    const tenderInCashUSDFromKHR = convertKHRToUSD(tenderInCashKHR, this.props.exchangeRate.sellRate);
    const tenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
    const totalTender = parseFloat(tenderInCashUSDFromKHR) + parseFloat(tenderInCashUSD);
    return totalTender;
  }

  getTotalTenderKHR() {
    const tenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
    const tenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
    const tenderInCashKHRFromUSD = convertUSDToKHR(tenderInCashUSD, this.props.exchangeRate.sellRate);
    const totalTender = parseFloat(tenderInCashKHR) + parseFloat(tenderInCashKHRFromUSD);
    return totalTender;
  }

  getGrandTotal() {
    const { summaryTotal, discountAmount, taxAmount } = this.props.summaryTotal;
    return SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount);
  }

  getGrandTotalInKHR() {
    const { summaryTotal, discountAmount, taxAmount } = this.props.summaryTotal;
    return SalesUtil.getGrandTotal(summaryTotal.subTotal, taxAmount, discountAmount) * this.props.exchangeRate.sellRate;
  }

  getChangeAmountInUSD() {
    return this.getTotalTenderUSD() - this.getGrandTotal();
  }

  getChangeAmountInKHR() {
    return Math.max(convertUSDToKHR(this.getChangeAmountInUSD(), this.props.exchangeRate.buyRate), 0);
  }

  handleOnFocusInputAmount = (isFocusOnBaseCurrency) => {
    if (isFocusOnBaseCurrency) {
      this.setState({ isFocusOnInputBaseCurrency: true });
    } else {
      this.setState({ isFocusOnInputBaseCurrency: false });
    }
  };

  handleCancel() {
    this.props.handleCancel();
  }

  handleOnQuickCash = (value, currency) => {
    if (currency === "USD") {
      const currentTenderInCashUSD = this.props.form.getFieldValue("tenderInCashUSD") || 0;
      this.props.form.setFieldsValue({
        tenderInCashUSD: currentTenderInCashUSD + parseFloat(value),
      });
      this.setState({ tenderInputFocus: "USD" });
    } else {
      const currentTenderInCashKHR = this.props.form.getFieldValue("tenderInCashKHR") || 0;
      this.props.form.setFieldsValue({
        tenderInCashKHR: currentTenderInCashKHR + parseFloat(value),
      });
      this.setState({ tenderInputFocus: "KHR" });
    }
  }

  handleOnSendMailReceipt = () => {
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
  };

  handleOnCompletePayment = () => {
    if (this.props.transaction.paid && this.state.isNotYetPaid) {
      this.props.dispatch(TransactionAction.reset());
      this.setState({
        isCustomerCredit: false,
        isAlreadyAutoPrint: false,
        isNotYetPaid: true,
        customerPaymentList: [],
        amountToPay: 0,
      });
      this.wrapClassName = "pos-payment";
      this.props.handleOnResetOrder();
    }
  };

  handleOnMakePayment = () => {
    this.props.form.validateFields((err, values) => {
      const totalTender = this.getTotalTenderUSD();
      const { discountAmount } = this.props.summaryTotal;
      const grandTotalUSD = this.getGrandTotal();

      if (!err && this.getTotalTenderUSD() >= grandTotalUSD) {
        const saleData = {
          customerId: this.props.customer ? this.props.customer.id : null,
          saleType: "RETAIL",
          paymentFlow: "PAY_FIRST",
          table: {},
          deposit: 0,
          discount: discountAmount,
          total: grandTotalUSD,
          // totalExcludeTax: summaryTotal.subTotal,
          items: this.mapFreeProductsToOrder(),
          tenderCash: totalTender,
          tenderBank: 0,
          paymentItems: this.state.customerPaymentList,
        };

        this.setState({ submittingPayment: true });
        RetailSaleService.createNewSale(saleData)
          .then((response) => {
            sweetalert({
              icon: "success",
              title: "Payment Successful!",
              text: "The payment has been completed successfully.",
              buttons: false,
              timer: 1500,
            }).then(() => {
              this.props.handleOnResetOrder();
              this.props.handleCancel();
            });
          })
          .catch((error) => {
            console.error("Error creating sale:", error);
          })
          .finally(() => {
            this.setState({ submittingPayment: false });
          });
      }
    });
  };

  renderMoneyExhangeAfterPay(balance, changeAmount) {
    if (this.state.customerPaymentList.length <= 0) {
      return [];
    } else {
      return [
        this.state.customerPaymentList.map((payment, paymentIndex) => (
          <li key={paymentIndex}>
            <div className="sub-total-title">{payment.paymentMethodName}</div>
            <div className="sub-total-value">{this.formatCurrency({ value: payment.tender })}</div>
          </li>
        )),
        changeAmount > 0 ? (
          <li key="a">
            <div className="sub-total-title">
              <this.Translate id="text_change" />
            </div>
            <div className="sub-total-value">{this.formatCurrency({ value: changeAmount })}</div>
          </li>
        ) : (
          ""
        ),
        <li key="b">
          <div className="text-uppercase grand-total-title">
            <this.Translate id="text_balance" />
          </div>
          <div className="grand-total-value">{this.formatCurrency({ value: balance })}</div>
        </li>,
      ];
    }
  }

  renderCrudAction() {}

  renderCustomerInfo() {
    return (
      <div className="customer-credit-info">
        <div className="inner-customer-credit-info">
          <div className="customer-info-title">
            <this.Translate id="text_customer_info" />
          </div>
          <div className="data-row" style={{ lineHeight: 1, marginBottom: 10 }}>
            <div>{`${this.props.customer.firstName} ${this.props.customer.lastName}`}</div>
            <div style={{ fontSize: "10pt" }}>{this.props.customer.phoneNumber}</div>
          </div>
          <div className="data-row" style={{ display: "flex", alignItems: "center" }}>
            <div>{<this.Translate id="text_credit_balance" />}:</div>
            <div style={{ fontSize: "16pt", fontFamily: "serif", paddingLeft: 10 }}>
              {this.formatCurrency({
                value: this.props.customer.credit ? this.props.customer.credit : 0,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const orderProducts = this.mapFreeProductsToOrder();
    const { summaryTotal, taxRate, discountAmount, taxAmount, discountTypeStr } = this.props.summaryTotal;
    const { exchangeRate, baseCurrency, isHasSubCurrency, subCurrency, receiptTemplate } = this.props;

    const { taxTitle, countTax } = this.props.summaryTax;

    const grandTotalUSD = this.getGrandTotal();
    const grandTotalKHR = convertUSDToKHR(grandTotalUSD, this.props.exchangeRate.sellRate);
    const changeAmount = this.getChangeAmountInUSD();

    let customer = {};

    if (this.props.transaction.paid) {
      this.wrapClassName += " pos-payment-paid"; //hidden close modal
    }

    if (this.props.transaction.response) {
      let { total, discount } = this.props.transaction.response.data;

      summaryTotal.subTotalAfterDiscount = total - discount;
      customer = this.props.transaction.response.data.customer;
      dataForReceipt = {
        data: this.props.transaction.response.data,
        exchangeRate,
        baseCurrency,
        subCurrency,
        isHasSubCurrency,
        receiptTemplate,
        currentUser: this.currentUser,
        customerPaymentList: this.state.customerPaymentList,
        customer: this.props.customer,
        isCustomerCredit: this.state.isCustomerCredit,
        productList: orderProducts,
        customerFieldPrice: this.props.customerFieldPrice,
        productTaxList: this.props.productTaxList,
        summaryTotal,
        summaryTax: this.props.summaryTax,
        grandTotalUSD,
        changeAmount,
        taxRate,
        taxAmount,
        discountAmount,
      };
    }

    return (
      <Drawer
        title={null}
        placement="bottom"
        height="90%"
        width={900}
        closable={false}
        onClose={this.props.handleCancel}
        visible={this.props.paymentVisible}
        destroyOnClose
        bodyStyle={{
          padding: 0,
        }}
        className="pos-payment-drawer"
      >
        <Row>
          <Col span={6} className="sale-summary">
            {/* <div className="title">
              <this.Translate id="text_sale_summary" />
            </div>
            <div className="list-order-summary">
              <ul className="list-unstyled">
                {orderProducts.map((productOrder, productOrderIndex) => (
                  <li key={productOrderIndex}>
                    <div className="title">
                      {productOrder.itemName}
                      {productOrder.variantName ? (
                        <div className="variant-name">
                          {productOrder.variantName}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="quantity">{productOrder.quantity}x</div>
                    <div className="price">
                      {productOrder.discount > 0 ? (
                        <div className="after-discount-price">
                          {this.formatCurrency(
                            SalesUtil.getTotalAmountAfterDiscount(
                              productOrder.quantity,
                              productOrder[this.props.customerFieldPrice] *
                                exchangeRate,
                              productOrder.discount,
                            ),
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                      <div
                        className={`main-price ${productOrder.discount > 0 ? "strike-price" : ""}`}
                        style={{
                          width: "100%",
                          paddingRight: productOrder.discount > 0 ? 16 : 0,
                        }}
                      >
                        {this.formatCurrency(
                          SalesUtil.getTotalAmount(
                            productOrder.quantity,
                            productOrder[this.props.customerFieldPrice] *
                              exchangeRate,
                          ),
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="list-unstyled ca-penel-v1 total-order-summary">
              <li>
                <div className="sub-total-title">
                  <this.Translate id="text_sub_total" />
                </div>
                <div className="sub-total-value">
                  {this.formatCurrency(
                    summaryTotal.subTotalAfterDiscount * exchangeRate,
                  )}
                </div>
              </li>
              <li>
                <div className="sub-total-title">
                  <this.Translate id="text_tax" /> {taxTitle}
                </div>
                <div className="sub-total-value">
                  {this.formatCurrency(taxAmount * exchangeRate)}
                </div>
              </li>
              {countTax > 1
                ? this.props.productTaxList.map(
                    (productTax, productTaxIndex) => (
                      <li key={productTaxIndex} className="tax-item">
                        <div className="sub-total-title">{productTax.name}</div>
                        <div className="sub-total-value">
                          {this.formatCurrency(
                            productTax.totalTaxAmount * exchangeRate,
                          )}
                        </div>
                      </li>
                    ),
                  )
                : ""}
              {discountAmount > 0 ? (
                <li>
                  <div className="sub-total-title">
                    <this.Translate id="text_discount" />
                    {discountTypeStr}
                  </div>
                  <div className="sub-total-value">
                    {this.formatCurrency(discountAmount * exchangeRate)}
                  </div>
                </li>
              ) : (
                ""
              )}
            </ul>
            <ul className="list-unstyled ca-penel-v1 grand-total">
              <li>
                <div className="wrap-grand-total-title">
                  <div className="text-uppercase grand-total-title">
                    <this.Translate id="text_total" />
                  </div>
                  <div className="total-quantity">
                    {orderProducts.length}{" "}
                    {summaryTotal.totalQuantity > 1 ? (
                      <this.Translate id="text_items" />
                    ) : (
                      <this.Translate id="text_item" />
                    )}
                  </div>
                </div>
                <div className="grand-total-value">
                  {this.formatCurrency(grandTotalUSD * exchangeRate)}
                </div>
              </li>
              {this.renderMoneyExhangeAfterPay(grandTotalUSD, changeAmount).map(
                (element) => element,
              )}
            </ul> */}
            {/* <ReceiptPreviewPanel>
              <ReceiptV2 orderItems={this.props.orderItems} exchangeRate={subCurrency?.value} />
            </ReceiptPreviewPanel> */}
            <div className="flex items-center justify-center p-4">
              <div className="w-full">
                <div className="bg-white" style={{ fontFamily: "monospace" }}>
                  <div className="text-center border-gray-300">
                    <h1 className="text-3xl font-bold mb-2">187</h1>
                    <h2 className="text-lg mb-2">Byte Store Center</h2>
                    <p className="text-sm">855069526809</p>
                  </div>

                  <div>
                    <table className="w-full text-xs mb-4">
                      <thead className="border-t border-b border-gray-400">
                        <tr>
                          <th className="text-left py-2">Description</th>
                          <th className="text-center">QTY</th>
                          <th className="text-right">Price</th>
                          <th className="text-right">Dis.</th>
                          <th className="text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.props.orderItems.map((orderItem, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2">{orderItem.itemName}</td>
                            <td className="text-center">{orderItem.quantity}</td>
                            <td className="text-right">{this.formatCurrency({ value: orderItem.price, showSymbol: false, position: 1 })}</td>
                            <td className="text-right">{orderItem.discount}%</td>
                            <td className="text-right">{this.formatCurrency({ value: orderItem.price * orderItem.quantity, showSymbol: false, position: 1 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="border-t-2 border-gray-400 pt-3 mb-2">
                      <div className="flex justify-between font-bold mb-2">
                        <span>Subtotal:</span>
                        <span>{this.formatCurrency({ value: summaryTotal.subTotal, currency: "$", position: 1 })}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Discount(0%):</span>
                        <span>{this.formatCurrency({ value: discountAmount, currency: "$", position: 1 })}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mb-2">
                        <span>Grand Total:</span>
                        <span>{this.formatCurrency({ value: grandTotalUSD, currency: "$", position: 1 })}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Exchange rate: {this.props.exchangeRate.sellRate.toLocaleString()}៛</span>
                        <span>{this.formatCurrency({ value: this.props.exchangeRate.sellRate * grandTotalUSD, currency: "៛", position: 1 })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col span={18} className="wrap-payment-tool" style={{ padding: 25 }}>
            {!this.props.transaction.paid ? (
              <div className="payment-tool">
                <Button
                  shape="circle"
                  icon="close"
                  style={{
                    border: "1px solid #e0e0e0",
                    color: "#999",
                    fontSize: 14,
                    position: "absolute",
                    right: 10,
                    marginRight: 30,
                    borderRadius: "50%",
                  }}
                  onClick={this.props.handleCancel}
                />
                <div className="total-display">
                  <div className="title-total-display">
                    <this.Translate id="text_amount_to_pay" />:
                  </div>
                  <div className="value-total-display">
                    <div className="payment-amount" id="drawerTotalKHR">
                      {this.formatCurrency({
                        value: grandTotalKHR,
                        currency: "៛",
                        position: 1,
                      })}
                    </div>
                    <div className="payment-amount-khr" id="drawerTotal">
                      {this.formatCurrency({
                        value: grandTotalUSD,
                        currency: "$",
                        position: 0,
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 15, marginTop: 30 }}>
                  <div className="amount-to-pay">
                    <Form.Item label="🇰🇭 Cash (KHR)" style={{ marginBottom: 0 }}>
                      {this.props.form.getFieldDecorator("tenderInCashKHR", {
                        initialValue: 0,
                        rules: [],
                      })(
                        <InputNumber
                          size="large"
                          className="khr-input"
                          ref={this.khrInputRef}
                          tabIndex={1}
                          form={this.props.form}
                          onFocus={(e) => {
                            e.target.select();
                            this.quickCashRef.current.setCurrency("KHR");
                            this.setState({ tenderInputFocus: "KHR" });
                          }}
                          handleOnBlur={() => this.handleOnFocusInputAmount(true)}
                        />,
                      )}
                    </Form.Item>
                  </div>
                  <div className="amount-to-pay">
                    <Form.Item label="💵 Cash (USD)" style={{ marginBottom: 0 }}>
                      {this.props.form.getFieldDecorator("tenderInCashUSD", {
                        initialValue: 0,
                        rules: [],
                      })(
                        <InputNumber
                          size="large"
                          ref={this.usdInputRef}
                          tabIndex={2}
                          className="usd-input"
                          form={this.props.form}
                          onFocus={(e) => {
                            e.target.select();
                            this.quickCashRef.current.setCurrency("USD");
                            this.setState({ tenderInputFocus: "USD" });
                          }}
                        />,
                      )}
                    </Form.Item>
                  </div>
                </div>

                <QuickCash totalUSD={grandTotalUSD} totalKHR={grandTotalKHR} ref={this.quickCashRef} onClick={this.handleOnQuickCash} />

                <PaymentSummary
                  tendered={this.formatCurrency({ value: this.getTotalTenderKHR(), currency: "៛", position: 1 })}
                  remaining={this.formatCurrency({ value: Math.max(grandTotalKHR - this.getTotalTenderKHR(), 0), currency: "៛", position: 1 })}
                  change={this.formatCurrency({ value: this.getChangeAmountInKHR(), currency: "៛", position: 1 })}
                  currency={"KHR"}
                />
              </div>
            ) : (
              <div className="confirm-payment">
                <div className="text-center title">
                  {changeAmount > 0 ? (
                    <span>
                      <this.Translate id="text_give" /> {this.formatCurrency(changeAmount * exchangeRate)} <this.Translate id="text_change" />
                    </span>
                  ) : (
                    <span>
                      <this.Translate id="text_payment" /> <this.Translate id="text_received" />
                    </span>
                  )}
                </div>
                <div className="wrap-email-receipt">
                  <this.InputEmail name="email" className="ca-input-v1" placeholder={this.CATranslate("text_email", this.props.locale)} form={this.props.form} />
                  <this.Button loading={this.props.mail.sending} type="info" className="margin-left-8 ca-button-v1 btn-send-email-receipt" onClick={this.handleOnSendMailReceipt}>
                    <this.Translate id="text_email_receipt" />
                  </this.Button>
                </div>
                <div className="complete-action">
                  <this.Button type="info" className="ca-button-v1 btn-send-email-receipt" onClick={this.handleOnCompletePayment}>
                    <this.Translate id="text_done" /> (ESC)
                  </this.Button>
                </div>
                {this.props.customer ? (
                  <table id="table-customer-reward-point">
                    <thead>
                      <tr>
                        <td
                          colSpan={2}
                          style={{
                            padding: 10,
                            borderBottom: "1px solid #ddd",
                          }}
                        >
                          {customer.firstName} {customer.lastName}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            width: "50%",
                            borderRight: "1px solid #ddd",
                            padding: 20,
                          }}
                        >
                          Redeem Points
                          <div>{customer.redeemedPoint}</div>
                        </td>
                        <td>
                          Points
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {this.Util.floor(customer.previousPoint)}
                            <span
                              style={{
                                color: "green",
                                fontSize: 13,
                                marginTop: -1,
                                marginLeft: 3,
                              }}
                            >
                              {" "}
                              + {this.Util.floor(customer.additionalPoint)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : null}
              </div>
            )}
          </Col>
        </Row>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e8e8e8",
            padding: "10px 16px",
            textAlign: "right",
            left: 0,
            background: "#fff",
            borderRadius: "0 0 4px 4px",
          }}
        >
          <Checkbox style={{ marginRight: 25 }} checked={true}>
            Print Receipt
          </Checkbox>
          <Tooltip title="Shortcut: F5">
            <Button size="large" style={{ marginRight: 15 }} onClick={() => this.props.form.resetFields()}>
              Reset
              <span
                style={{
                  background: "#eee",
                  borderRadius: 3,
                  padding: "2px 5px",
                  fontSize: 12,
                  color: "#333",
                  marginLeft: 5,
                }}
              >
                F5
              </span>
            </Button>
          </Tooltip>
          <Tooltip title="Shortcut: Enter">
            <Button size="large" onClick={this.handleOnMakePayment} type="primary" loading={this.state.submittingPayment} disabled={this.state.submittingPayment || this.getTotalTenderUSD() < grandTotalUSD}>
              Confirm Payment
              <span
                style={{
                  background: "#eee",
                  borderRadius: 3,
                  padding: "2px 5px",
                  fontSize: 12,
                  color: "#333",
                  marginLeft: 5,
                }}
              >
                Enter
              </span>
            </Button>
          </Tooltip>
        </div>
      </Drawer>
    );
  }
}

PaymentScreen.defaultProps = {
  orderItems: [],
  customerFieldPrice: "price",
};
