import React from "react";
import htmlParse from "html-react-parser";
import JsBarcode from "jsbarcode";
import MainUtil from "../../../../common/util";
import ReceiptA4 from "./ReceiptA4";
import ReceiptExcludeTax from "./ReceiptA4V3/ReceiptExcludeTax";
import ReceiptIncludeTax from "./ReceiptA4V3/ReceiptIncludeTax";
import { PaperSize } from "../../settings/ReceiptTemplate/PaperSize";
import Component from "../../../../common/components/Component";
import Enum from "../../../enums";
import Util from "../../../utils";
import "./Receipt.css";

export default class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoContent: ""
    };
    this.util = new MainUtil();
    this.contentId = "pos-receipt-preview";
  }
  componentDidMount() {
    const elementGenerateBarcode = document.getElementById("receiptCarcode");
    if (elementGenerateBarcode) {
      JsBarcode("#receiptCarcode", this.props.data.receiptNumber ? this.props.data.receiptNumber : this.props.data.number, {
        height: 35,
        displayValue: false
      });
    }

    const logoContent = document.getElementById("receiptLogoPreLoading");
    if (logoContent) {
      this.setState({logoContent: logoContent.innerHTML});
    }
  }

  renderTitle = (data) => {
    return this.props.isRequestShowDetail ?
      <div  style={{ position: "relative", margin: "0 auto", marginBottom: "4px" }}>
        <img height="60px" style={{ maxWidth: "177px" }} alt="" src={this.util.getGeneralImage(`${data.clientId}/general/${data.client ? data.client.logo : ""}`).url} />
        {/* <img height="60px" style={{ maxWidth: "177px" }} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url} /> */}
      </div>
      :
      <div style={{ position: "relative", margin: "0 auto" }}>
        {this.state.logoContent ? this.state.logoContent : <img style={{ width: 100 }} alt="" src={this.util.getGeneralImage(`${data.clientId}/general/${data.client ? data.client.logo : ""}`).url} />}
      </div>;
  }

  renderStoreName = (paperSize, businessName) => {
    return this.props.receiptTemplate.isShowStoreName ?
      <tr>
        <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white", fontSize: paperSize.setting.storeNameFontSize }}>{businessName}</td>
      </tr>
      :
      <tr />;
  }

  renderCustomerFooter = () => {

  }

  renderHeader = (paperSize) => {
    let cashier = "";
    if (this.props.currentUser) {
      if (this.props.currentUser.currentUser) {
        cashier = this.props.currentUser.currentUser.fullName;
      }
    }
    const paddingTopForHeaderAndFooter = paperSize.code === Enum.PAPER_SIZE.MINI_THERMAL ? -10 : 2.5;

    if (paperSize.code === Enum.PAPER_SIZE.A4) {

      if (this.props.customer) {
        return <table style={{ color: paperSize.setting.color, fontSize: paperSize.setting.dataFontSize, backgroundColor: "white", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left", paddingTop: 10, paddingRight: 0 }}><this.Translate id="text_customer_name" />. {`${this.props.customer.firstName} ${this.props.customer.lastName}`}</td>
              <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: 10 }}><this.Translate id="text_date" />: {this.Util.formatDate(this.props.data.createdAt, "DD MMM YYYY h:mm A")}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left" }}><this.Translate id="text_phone_number" />: {this.props.customer.phoneNumber}</td>
              <td style={{ backgroundColor: "white", textAlign: "right" }}><this.Translate id="receipt_no" />. {this.props.data.receiptNumber ? this.props.data.receiptNumber : this.props.data.number}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left" }}><this.Translate id="text_address" />: {htmlParse(this.props.customer.address)}</td>
              <td style={{ backgroundColor: "white", textAlign: "right" }}><this.Translate id="text_cashier" />. {cashier}</td>
            </tr>
          </tbody>
        </table>;
      }

      return <table style={{ color: paperSize.setting.color, fontSize: paperSize.setting.dataFontSize, backgroundColor: "white", width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: "white", textAlign: "left", paddingTop: 10, paddingRight: 0 }}><this.Translate id="register_no" />. {this.Util.getDeviceNumber()}</td>
            <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: 10 }}><this.Translate id="text_date" />: {this.Util.formatDate(this.props.data.createdAt, "DD MMM YYYY h:mm A")}</td>
          </tr>
          <tr>
            <td style={{ backgroundColor: "white", textAlign: "left" }}><this.Translate id="receipt_no" />. {this.props.data.receiptNumber ? this.props.data.receiptNumber : this.props.data.number}</td>
            <td style={{ backgroundColor: "white", textAlign: "right" }}><this.Translate id="text_cashier" />: {cashier}</td>
          </tr>
        </tbody>
      </table>;
    
  
    }else {
      return <table className="invoice-title" style={{ color: paperSize.setting.color, fontSize: paperSize.setting.dataFontSize, backgroundColor: "white" }}>
        <style>
        {"@media print { table tr td { line-height: 8px } }"}
      </style>
        <tbody>
          <tr>
            <td valign="top" colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}>
                <this.Translate id="text_date" />: {this.Util.formatDate(this.props.data.createdAt, "DD MMM YYYY h:mm A")}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}><this.Translate id="receipt_no" />: {this.props.data.receiptNumber ? this.props.data.receiptNumber : this.props.data.number}</td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}><this.Translate id="text_cashier" />: <span style={{ textTransform: "uppercase" }}>{cashier}</span></td>
          </tr>
          {
            this.props.receiptTemplate.isHasSubCurrency ?
              <tr>
                <td colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}><this.Translate id="exchange_rate" />: {this.Util.formatCurrency(this.props.subCurrency.value, this.props.subCurrency.symbol)}</td>
              </tr>
              :
              <tr />
          }
        </tbody>
      </table>;
    }
  }

  renderQRCode = () => {
    return <tr>
      <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>
        <img id="receiptCarcode" alt="" />
      </td>
    </tr>;
  }

  render() {
    let businessName = "";
    let address = "";
    let phoneNumber = "";
    let email = "";
    if (this.props.currentUser) {
      if (this.props.currentUser.setting) {
        businessName = this.props.currentUser.setting.businessName;
        address = this.props.currentUser.setting.address;
        phoneNumber = this.props.currentUser.setting.phoneNumber;
        email = this.props.currentUser.setting.email;
      }
    }
    
    const {
      taxTitle,
      countTax
    } = this.props.summaryTax;

    let paperSize = PaperSize.find(paperValue => paperValue.code === /*this.props.receiptTemplate.paperSize*/Enum.PAPER_SIZE.THERMAL);
    if (!paperSize) {
      paperSize = PaperSize[0];
    }

    const total = this.props.summaryTotal.subTotalAfterDiscount + this.props.taxAmount;
    const {exchangeRate} = this.props;

    return <div id={this.contentId} ref={ref => this.contentRef = ref}>
        {
        paperSize.code === Enum.PAPER_SIZE.A4 ?
          <ReceiptA4
            data={{
              client: {
                businessName,
                address,
                phoneNumber,
                email
              },
              number: this.props.data.number,
              createdAt: this.props.data.createdAt,
              customer: this.props.customer,
              discount: this.props.discountAmount,
              taxAmount: this.props.taxAmount,
              total,
            }}
            receiptTemplate={this.props.receiptTemplate}
            productList={this.props.productList}
            dispatch={this.props.dispatch} /> 

            : 

           paperSize.code === Enum.PAPER_SIZE.EXCLUDE_TAX ?  
           
           <ReceiptExcludeTax
            data={{
              client: {
                businessName,
                address,
                phoneNumber,
                email
              },
              number: this.props.data.number,
              createdAt: this.props.data.createdAt,
              customer: this.props.customer,
              defaultCurrency: this.props.data.defaultCurrency,
              discount: this.props.discountAmount,
              taxAmount: this.props.taxAmount,
              total,
            }}
            receiptTemplate={this.props.receiptTemplate}
            productList={this.props.productList}
            dispatch={this.props.dispatch} /> 

          :

          paperSize.code === Enum.PAPER_SIZE.INCLUDE_TAX ?
          <ReceiptIncludeTax
          data={{
            client: {
              businessName,
              address,
              phoneNumber,
              email
            },
            number: this.props.data.number,
            createdAt: this.props.data.createdAt,
            customer: this.props.customer,
            defaultCurrency: this.props.data.defaultCurrency,
            discount: this.props.discountAmount,
            taxAmount: this.props.taxAmount,
            total,
          }}
          receiptTemplate={this.props.receiptTemplate}
          productList={this.props.productList}
          dispatch={this.props.dispatch} /> 

          :

          <div style={{
            margin: "0 auto",
            fontFamily: "Khmer OS Content",
            pageBreakBefore: "always"
          }} >
            <table style={{
              color: paperSize.setting.color,
              fontSize: paperSize.setting.dataFontSize,
              backgroundColor: "white",
              margin: "auto",
              width: paperSize.setting.width,
              padding: paperSize.setting.padding,
              marginLeft: this.props.isRequestClearMarginLeft ? 0 : paperSize.setting.marginLef
            }}>
              <tbody>
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>
                    {this.renderTitle(this.props.data)}
                  </td>
                </tr>
                {this.renderStoreName(paperSize, businessName)}
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>{htmlParse(address)} {phoneNumber}</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    {this.renderHeader(paperSize)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{ paddingTop: 5, backgroundColor: "white" }}>
                    <table style={{ fontSize: paperSize.setting.dataFontSize, color: paperSize.setting.color, margin: "0 auto" }}>
                      <thead>
                        <tr>
                          <th style={{ fontWeight: 500, width: "8mm", textAlign: "center", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                            <this.Translate id="text_qty" />
                          </th>
                          <th style={{ fontWeight: 500, padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color, textAlign: "left" }}>
                            <this.Translate id="text_desc" />
                          </th>
                          <th style={{ fontWeight: 500, width: "16mm", textTransform: "uppercase", textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                            <this.Translate id="text_price" />
                          </th>
                          <th style={{ fontWeight: 500, width: "17mm", textTransform: "uppercase", textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                            <this.Translate id="text_amount" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="3" style={{ backgroundColor: "white" }} />
                        </tr>
                        {
                          this.props.productList.map((product, index) =>
                            <tr key={index}>
                              <td style={{ textAlign: "center", backgroundColor: "white" }}>{product.quantity}</td>
                              <td style={{ backgroundColor: "white", paddingTop: 2, paddingBottom: 2 }}>
                                <div style={{lineHeight: "12px"}}>{product.name ? product.name : product.namekm}</div>
                                  {
                                    product.variantName ?
                                      <div style={{ fontSize: paperSize.setting.subDataFontSize }}>{product.variantName}</div>
                                      :
                                      ""
                                  }
                              </td>
                              <td style={{ textAlign: "right", backgroundColor: "white" }}>{this.formatCurrency(product[this.props.customerFieldPrice] * exchangeRate)}</td>
                              <td style={{ textAlign: "right", backgroundColor: "white" }}>{this.formatCurrency((product[this.props.customerFieldPrice] * product.quantity) * exchangeRate)}</td>
                            </tr>
                          )
                        }
                        <tr>
                          <td colSpan="3" style={{ backgroundColor: "white" }} />
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td style={{ backgroundColor: "white", borderTop: "1px dashed " + paperSize.setting.color, paddingTop: 5 }} />
                          <td colSpan="2" style={{ backgroundColor: "white", borderTop: "1px dashed " + paperSize.setting.color, paddingTop: 5, textDecoration: "uppercase" }}><this.Translate id="text_sub_total" />:</td>
                          <td style={{ backgroundColor: "white", textAlign: "right", borderTop: "1px dashed " + paperSize.setting.color, paddingTop: 5 }}>{this.formatCurrency((this.props.summaryTotal.subTotalAfterDiscount + this.props.discountAmount) * exchangeRate)}</td>
                        </tr>
                        {
                          this.props.taxAmount > 0 ?
                          <tr>
                            <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                            <td colSpan="2" style={{ backgroundColor: "white" }}>
                              <span className="text-uppercase"><this.Translate id="text_tax" /></span> {taxTitle}:
                            </td>
                            <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.formatCurrency(this.props.taxAmount * exchangeRate)}</td>
                          </tr>
                          :
                          <tr/>
                        }
                        <tr>
                          <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                          <td colSpan="2" style={{ backgroundColor: "white" }}><this.Translate id="text_discount" />:</td>
                          <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.formatCurrency(this.props.discountAmount * exchangeRate)}</td>
                        </tr>
                        <tr>
                          <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                          <td colSpan="2" style={{ backgroundColor: "white" }}><this.Translate id="text_total" />{this.props.receiptTemplate.isHasSubCurrency ? `(${this.props.baseCurrency.symbol})` : ""}:</td>
                          <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.formatCurrency(total, "$")}</td>
                        </tr>
                        {
                          this.props.receiptTemplate.isHasSubCurrency ?
                            <tr>
                              <td style={{ backgroundColor: "white" }} />
                              <td colSpan="2" style={{ backgroundColor: "white", textDecoration: "uppercase" }}>សរុប{`(${this.props.receiptTemplate.subCurrency ? this.props.receiptTemplate.subCurrency.symbol : ""})`}:</td>
                              <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.Util.formatCurrency(Util.toSubCurrencyGrantTotal(total, this.props.baseCurrency, this.props.subCurrency), this.props.subCurrency.symbol)}</td>
                            </tr>
                            :
                            <tr />
                        }
                        {
                          countTax > 1 ?
                            this.props.productTaxList.map((productTax, productTaxIndex) =>
                              productTax.totalTaxAmount > 0 ?
                                <tr key={productTaxIndex}>
                                  <td style={{ backgroundColor: "white" }} />
                                  <td colSpan="2" style={{ backgroundColor: "white", paddingLeft: 15 }}>
                                    {productTax.name}
                                  </td>
                                  <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.formatCurrency(productTax.totalTaxAmount)}</td>
                                </tr>
                                :
                                ""
                            )
                            :
                            <tr />
                        }
                        {
                          this.props.isCustomerCredit ?
                            <tr />
                            :
                            <tr>
                              <td colSpan={4} style={{ backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }} ></td>
                            </tr>
                        }
                        {
                          this.props.isCustomerCredit ?
                            <tr />
                            :
                            this.props.customerPaymentList.map((customerPayment, customerPaymentIndex) =>
                              <tr key={customerPaymentIndex}>
                                <td style={{ backgroundColor: "white", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }} />
                                <td colSpan="2" style={{ backgroundColor: "white", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }}>{customerPayment.paymentMethodName}:</td>
                                <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }}>{this.formatCurrency(customerPayment.tender * exchangeRate)}</td>
                              </tr>
                            )
                        }
                        {
                          this.props.isCustomerCredit ?
                            <tr />
                            :
                            <tr>
                              <td style={{ backgroundColor: "white" }} />
                              <td colSpan="2" style={{ backgroundColor: "white" }}><this.Translate id="text_change" />{this.props.isHasSubCurrency ? `(${this.props.baseCurrency.symbol})` : ""}:</td>
                              <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.formatCurrency(this.props.changeAmount, "$")}</td>
                            </tr>
                        }
                        {
                          !this.props.isCustomerCredit && this.props.isHasSubCurrency ?
                            <tr>
                              <td style={{ backgroundColor: "white" }} />
                              <td colSpan="2" style={{ backgroundColor: "white" }}>ប្រាក់អាប់{`(${this.props.subCurrency.symbol})`}:</td>
                              <td style={{ backgroundColor: "white", textAlign: "right" }}>{this.Util.formatCurrency(Util.toSubCurrencyGrantTotal(this.props.changeAmount, this.props.baseCurrency, this.props.subCurrency), this.props.subCurrency.symbol)}</td>
                            </tr>
                            :
                            <tr />
                        }
                      </tfoot>
                    </table>
                  </td>
                </tr>
                <tr>
                  {this.renderCustomerFooter(paperSize)}
                </tr>
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white", paddingTop: 20, textTransform: "uppercase" }}><this.Translate id="text_thank_you_on_receipt" /></td>
                </tr>
                {/* {this.renderQRCode()} */}
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}><this.Translate id="text_feedback_keep_on_receipt" /></td>
                </tr>
                {
                  this.props.receiptTemplate.isShowDevelopBy ?
                    <tr>
                      <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>www.storevein.com</td>
                    </tr>
                    :
                    <tr></tr>
                }
              </tbody>
            </table>
          </div>
        
        }

        {/* {
           paperSize.code === Enum.PAPER_SIZE.A4V3 ? "" : ""
        } */}
        
      </div>;
  }
}

Receipt.defaultProps = {
  receiptTemplate: {
    logo: ""
  },
  customerFieldPrice: "price",
  isRequestClearMarginLeft: false,
  isCustomerCredit: false
  //We use it to help when to want clear marginLeft (-30px) in case mini printer 58mm. The problem is because of margin
};
