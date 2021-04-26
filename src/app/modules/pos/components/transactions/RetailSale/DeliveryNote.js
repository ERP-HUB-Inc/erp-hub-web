import React from "react";
import Receipt from "./Receipt";

export default class DeliveryNote extends Receipt {

  constructor(props) {
    super(props);

    this.contentId = "delivery-order-preview";
  }

  renderTitle = () => {}

  renderQRCode = () => { }

  renderStoreName = (paperSize, businessName) => {
    return <tr>
        <td colSpan={2} style={{ textAlign: "center", backgroundColor: "white" }}>
          <div style={{ fontSize: "16pt" }}>
            {businessName}
          </div>
          <div style={{ fontSize: "14pt" }}>
            Delivery Order
          </div>
        </td>
      </tr>;
  }

  renderCustomerFooter = (paperSize) => {
    return <td colSpan="2" style={{ backgroundColor: "white" }}>
      <table style={{ color: paperSize.setting.color, fontSize: "9.5pt", margin: "0 auto", marginTop: 30, marginBottom: 30 }}>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", backgroundColor: "white", width: "30mm" }}><this.Translate id="text_buyer" /></td>
            <td style={{ width: "5mm" }} />
            <td style={{ textAlign: "center", backgroundColor: "white", width: "30mm" }}><this.Translate id="text_receiver" /></td>
            <td style={{ width: "5mm" }} />
            <td style={{ textAlign: "center", backgroundColor: "white", width: "30mm" }}><this.Translate id="text_driver" /></td>
            <td style={{ width: "5mm" }} />
            <td style={{ textAlign: "center", backgroundColor: "white", width: "30mm" }}><this.Translate id="text_seller" /></td>  
          </tr>
          <tr>
            <td style={{ borderBottom: "1px solid " + paperSize.setting.color, height: 50, backgroundColor: "white" }} />
            <td style={{ width: "5mm" }} />
            <td style={{ borderBottom: "1px solid " + paperSize.setting.color, backgroundColor: "white" }} />
            <td style={{ width: "5mm" }} />
            <td style={{ borderBottom: "1px solid " + paperSize.setting.color, backgroundColor: "white" }} />
            <td style={{ width: "5mm" }} />
            <td style={{ borderBottom: "1px solid " + paperSize.setting.color, backgroundColor: "white" }} />
          </tr>
        </tbody>
      </table>
    </td>;
  }

  renderHeader = (paperSize) => {
    let cashier = "";
    if (this.props.currentUser) {
      if (this.props.currentUser.currentUser) {
        cashier = this.props.currentUser.currentUser.fullName;
      }
    }

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
          <td style={{ backgroundColor: "white", textAlign: "left" }}><this.Translate id="text_address" />: {this.props.customer.address}</td>
          <td style={{ backgroundColor: "white", textAlign: "right" }}><this.Translate id="text_cashier" />. {cashier}</td>
        </tr>
      </tbody>
    </table>;
  }
}