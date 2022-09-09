import React from "react";
import { Translate } from "react-localize-redux";
import htmlParse from "html-react-parser";
import Util from "../../../../../common/util";
import POSUtil from "../../../../utils";
import {PaperSize} from "../../../settings/ReceiptTemplate/PaperSize";
import Enum from "../../../../enums";

export default function ReceiptTemplate2(props) {
  const [logoContent, setLogoContent] = React.useState(false);
  const util = new Util();
  function renderTitle(data) {
    return props.isRequestShowDetail ?
      <div  style={{ position: "relative", margin: "0 auto", marginBottom: "4px" }}>
        <img height="60px" style={{ maxWidth: "177px" }} alt="" src={util.getGeneralImage(`${data.clientId}/general/${data.client ? data.client.logo : ""}`).url} />
      </div>
      :
      <div style={{ position: "relative", margin: "0 auto" }}>
        {logoContent ? logoContent : <img style={{ width: 100 }} alt="" src={util.getGeneralImage(`${data.clientId}/general/${data.client ? data.client.logo : ""}`).url} />}
      </div>;
  }

  function renderStoreName(paperSize, businessName) {    
    return <tr>
      <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white", fontSize: paperSize.setting.storeNameFontSize}}>{businessName}</td>
    </tr>;
  }

  function renderHeader(paperSize) {
    let cashier = "";
    if (props.currentUser) {
      if (props.currentUser.currentUser) {
        cashier = props.currentUser.currentUser.fullName;
      }
    }
    const paddingTopForHeaderAndFooter = paperSize.code === Enum.PAPER_SIZE.MINI_THERMAL ? -10 : 2.5;

    if (paperSize.code === Enum.PAPER_SIZE.A4) {

      if (props.customer) {
        return <table style={{ color: paperSize.setting.color, fontSize: paperSize.setting.dataFontSize, backgroundColor: "white", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left", paddingTop: 10, paddingRight: 0 }}><Translate id="text_customer_name" />. {`${props.customer.firstName} ${props.customer.lastName}`}</td>
              <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: 10 }}><Translate id="text_date" />: {util.formatDate(props.data.createdAt, "DD MMM YYYY h:mm A")}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left" }}><Translate id="text_phone_number" />: {props.customer.phoneNumber}</td>
              <td style={{ backgroundColor: "white", textAlign: "right" }}><Translate id="receipt_no" />. {props.data.receiptNumber ?props.data.receiptNumber : props.data.number}</td>
            </tr>
            <tr>
              <td style={{ backgroundColor: "white", textAlign: "left" }}><Translate id="text_address" />: {htmlParse(props.customer.address)}</td>
              <td style={{ backgroundColor: "white", textAlign: "right" }}><Translate id="text_cashier" />. {cashier}</td>
            </tr>
          </tbody>
        </table>;
      }

      return <table style={{ color: paperSize.setting.color, fontSize: paperSize.setting.dataFontSize, backgroundColor: "white", width: "100%" }}>
        <tbody>
          <tr>
            <td style={{ backgroundColor: "white", textAlign: "left", paddingTop: 10, paddingRight: 0 }}><Translate id="register_no" />. {util.getDeviceNumber()}</td>
            <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: 10 }}><Translate id="text_date" />: {util.formatDate(props.data.createdAt, "DD MMM YYYY h:mm A")}</td>
          </tr>
          <tr>
            <td style={{ backgroundColor: "white", textAlign: "left" }}><Translate id="receipt_no" />. {props.data.receiptNumber ? props.data.receiptNumber : props.data.number}</td>
            <td style={{ backgroundColor: "white", textAlign: "right" }}><Translate id="text_cashier" />: {cashier}</td>
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
            <td  colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: 10 }}>
              <Translate id="register_no" />: {util.getDeviceNumber()}
            </td>
          </tr>
          <tr>
            <td valign="top" colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}>
              <Translate id="text_date" />: {util.formatDate(props.data.createdAt, "DD MMM YYYY h:mm A")}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}><Translate id="receipt_no" />: {props.data.receiptNumber ? props.data.receiptNumber : props.data.number}</td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: "white", textAlign: "left", paddingTop: paddingTopForHeaderAndFooter }}><Translate id="text_cashier" />: <span style={{ textTransform: "uppercase" }}>{cashier}</span></td>
          </tr>
        </tbody>
      </table>;
    }
  };

  function renderCustomerFooter(paperSize) {

  }

  React.useEffect(() => {
    const logoContent = document.getElementById("receiptLogoPreLoading");
    if (logoContent) {
      setLogoContent(logoContent.innerHTML);
    }
  }, []);
  let businessName = "";
  let address = "";
  let phoneNumber = "";
  if (props.currentUser) {
    if (props.currentUser.setting) {
      businessName = props.currentUser.setting.businessName;
      address = props.currentUser.setting.address;
      phoneNumber = props.currentUser.setting.phoneNumber;
      //email = props.currentUser.setting.email;
    }
  }

  const {
    taxTitle
  } = props.summaryTax;
  
  let paperSize = PaperSize.find(paperValue => paperValue.code === /*props.receiptTemplate.paperSize*/Enum.PAPER_SIZE.THERMAL);
  if (!paperSize) {
    paperSize = PaperSize[0];
  }

  const total = props.summaryTotal.subTotalAfterDiscount + props.taxAmount;
  return (
    <div style={{
      margin: "0 auto",
      fontFamily: "Khmer OS Content",
      pageBreakBefore: "always",
      paddingTop: 40
    }} >
      <table style={{
        color: paperSize.setting.color,
        fontSize: paperSize.setting.dataFontSize,
        backgroundColor: "white",
        margin: "auto",
        width: paperSize.setting.width,
        padding: paperSize.setting.padding,
        marginLeft: props.isRequestClearMarginLeft ? 0 : paperSize.setting.marginLef
      }}>
        <tbody>
          <tr>
            <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>
              {renderTitle(props.data)}
            </td>
          </tr>
          {renderStoreName(paperSize, businessName)}
          <tr>
            <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>{htmlParse(address)} {phoneNumber}</td>
          </tr>
          <tr>
            <td colSpan="2">
              {renderHeader(paperSize)}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ paddingTop: 5, backgroundColor: "white" }}>
              <table style={{ fontSize: paperSize.setting.dataFontSize, color: paperSize.setting.color, margin: "0 auto" }}>
                <thead>
                  <tr>
                    <th style={{ fontWeight: 500, width: "8mm", textAlign: "center", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                      <Translate id="text_qty" />
                    </th>
                    <th style={{ fontWeight: 500, padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color, textAlign: "left" }}>
                      <Translate id="text_desc" />
                    </th>
                    <th style={{ fontWeight: 500, width: "16mm", textTransform: "uppercase", textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                      <Translate id="text_price" />
                    </th>
                    <th style={{ fontWeight: 500, width: "17mm", textTransform: "uppercase", textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }}>
                      <Translate id="text_amount" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="3" style={{ backgroundColor: "white" }} />
                  </tr>
                  {
                    props.productList.map((product, index) =>
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
                        <td style={{ textAlign: "right", backgroundColor: "white" }}>{util.formatCurrency(product[props.customerFieldPrice])}</td>
                        <td style={{ textAlign: "right", backgroundColor: "white" }}>{util.formatCurrency(product[props.customerFieldPrice] * product.quantity)}</td>
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
                    <td colSpan="2" style={{ backgroundColor: "white", borderTop: "1px dashed " + paperSize.setting.color, paddingTop: 5, textDecoration: "uppercase" }}><Translate id="text_sub_total" />:</td>
                    <td style={{ backgroundColor: "white", textAlign: "right", borderTop: "1px dashed " + paperSize.setting.color, paddingTop: 5 }}>{util.formatCurrency(props.summaryTotal.subTotalAfterDiscount + props.discountAmount)}</td>
                  </tr>
                  {
                    props.taxAmount > 0 ?
                    <tr>
                      <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                      <td colSpan="2" style={{ backgroundColor: "white" }}>
                        <span className="text-uppercase"><Translate id="text_tax" /></span> {taxTitle}:
                      </td>
                      <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(props.taxAmount)}</td>
                    </tr>
                    :
                    <tr/>
                  }
                  <tr>
                    <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                    <td colSpan="2" style={{ backgroundColor: "white" }}><Translate id="text_discount" />:</td>
                    <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(props.discountAmount)}</td>
                  </tr>
                  <tr>
                    <td style={{ backgroundColor: "white", paddingTop: 5 }} />
                    <td colSpan="2" style={{ backgroundColor: "white" }}><Translate id="text_total" />:</td>
                    <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(total)}</td>
                  </tr>
                  {
                    props.receiptTemplate && props.receiptTemplate.isHasSubCurrency ?
                      <tr>
                        <td style={{ backgroundColor: "white" }} />
                        <td colSpan="2" style={{ backgroundColor: "white", textDecoration: "uppercase" }}>សរុប{`(${props.receiptTemplate.subCurrency.symbol})`}:</td>
                        <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(POSUtil.toSubCurrencyGrantTotal(total, props.receiptTemplate.baseCurrency, props.receiptTemplate.subCurrency), props.receiptTemplate.subCurrency.symbol)}</td>
                      </tr>
                      :
                      <tr />
                  }
                  {
                    props.isCustomerCredit ?
                      <tr />
                      :
                      <tr>
                        <td colSpan={4} style={{ backgroundColor: "white", borderBottom: "1px dashed " + paperSize.setting.color }} ></td>
                      </tr>
                  }
                  {
                    props.isCustomerCredit ?
                      <tr />
                      :
                      props.customerPaymentList.map((customerPayment, customerPaymentIndex) =>
                        <tr key={customerPaymentIndex}>
                          <td style={{ backgroundColor: "white", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }} />
                          <td colSpan="2" style={{ backgroundColor: "white", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }}>{customerPayment.paymentMethodName}:</td>
                          <td style={{ backgroundColor: "white", textAlign: "right", paddingTop: customerPaymentIndex === 0 ? 5 : 0 }}>{util.formatCurrency(customerPayment.tender)}</td>
                        </tr>
                      )
                  }
                  {
                    props.isCustomerCredit ?
                      <tr />
                      :
                      <tr>
                        <td style={{ backgroundColor: "white" }} />
                        <td colSpan="2" style={{ backgroundColor: "white" }}><Translate id="text_change" />:</td>
                        <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(props.changeAmount)}</td>
                      </tr>
                  }
                  {
                    !props.isCustomerCredit && props.receiptTemplate && props.receiptTemplate.isHasSubCurrency ?
                      <tr>
                        <td style={{ backgroundColor: "white" }} />
                        <td colSpan="2" style={{ backgroundColor: "white" }}>ប្រាក់អាប់{`(${props.receiptTemplate.subCurrency.symbol})`}:</td>
                        <td style={{ backgroundColor: "white", textAlign: "right" }}>{util.formatCurrency(POSUtil.toSubCurrencyGrantTotal(props.changeAmount, props.receiptTemplate.baseCurrency, props.receiptTemplate.subCurrency), props.receiptTemplate.subCurrency.symbol)}</td>
                      </tr>
                      :
                      <tr />
                  }
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            {renderCustomerFooter(paperSize)}
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white", paddingTop: 20, textTransform: "uppercase" }}><Translate id="text_thank_you_on_receipt" /></td>
          </tr>
          {/* {renderQRCode()} */}
          <tr>
            <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}><Translate id="text_feedback_keep_on_receipt" /></td>
          </tr>
          {
            props.receiptTemplate && props.receiptTemplate.isShowDevelopBy ?
              <tr>
                <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>www.storevein.com</td>
              </tr>
              :
              <tr></tr>
          }
        </tbody>
      </table>
    </div>
  );
}
