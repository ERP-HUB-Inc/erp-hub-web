import React from "react";
import JsBarcode from "jsbarcode";
import Component from "../../../../common/components/Component";
export default class Receipt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: null
    };
    this.initializeImage = this.initializeImage.bind(this);
  }
  componentDidMount() {
    JsBarcode("#receiptCarcode", this.props.data.receiptNumber, {
      height: 35,
      displayValue: false
    });
    this.Util.validImage(this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url, this.initializeImage);
  }

  initializeImage(status) {
    if (status === "success") {
      this.setState({logo: this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url});
    } else if (status === "error") {
      this.setState({logo: null});
    }
  }

  render() {
    let storeName = "";
    let address = "";
    let phoneNumber = "";
    let cashier = "";
    if (this.props.currentUser) {
      if (this.props.currentUser.setting) {
        storeName = this.props.currentUser.setting.storeName;
        address = this.props.currentUser.setting.address;
        phoneNumber = this.props.currentUser.setting.phoneNumber;
      }

      if (this.props.currentUser.currentUser) {
        cashier = this.props.currentUser.currentUser.fullName;
      }
    }

    const {
      taxTitle,
      countTax
    } = this.props.summaryTax; console.log("LOGO:", this.state.logo);

    return (
      <div style={{display: "none"}} id="pos-receipt-preview">
        <div style={{
          padding: "15px 15px",
          // backgroundColor: "#f5f2f2",
          margin: "0 auto",
          fontFamily: "Arial"
        }}>
          <table style={{color: "rgb(142, 136, 136)", fontSize: "8pt", backgroundColor: "white", margin: "auto", width: "120mm", padding: 5}}>
            <tbody><tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>
                <div style={{width: 100, position: "relative", borderRadius: 100, margin: "auto", overflow: "hidden"}}>
                  {
                    this.state.logo ?
                      <img alt="" src={this.state.logo} style={{position: "absolute", left: 0, right: 0, bottom: 0, top: 0, margin: "auto"}} />
                      :
                      ""
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white", fontSize: "30pt"}}>{storeName}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>{address} {phoneNumber}</td>
            </tr>
            <tr>
              <td style={{backgroundColor: "white", textAlign: "left", paddingTop: 30}}><this.Translate id="register_no"/>. {this.Util.getDeviceNumber()}</td>
              <td style={{backgroundColor: "white", textAlign: "right", paddingTop: 30}}><this.Translate id="text_date"/>: {this.Util.formatDate(this.props.data.createdAt, "DD MMMM YYYY h:mm A")}</td>
              {/* 12 June 2018 11:30 AM */}
            </tr>
            <tr>
              <td style={{backgroundColor: "white", textAlign: "left"}}><this.Translate id="receipt_no"/>. {this.props.data.receiptNumber}</td>
              <td style={{backgroundColor: "white", textAlign: "right"}}><this.Translate id="text_cashier"/>: {cashier}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{paddingTop: 10}}>
                <table style={{fontSize: "8pt", color: "rgb(142, 136, 136)"}}>
                  <thead>
                    <tr>
                      <th style={{fontWeight: 500, width: "10mm", textAlign: "center", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)"}}>
                        <this.Translate id="text_qty"/>
                      </th>
                      <th style={{fontWeight: 500, width: "90mm", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)", textAlign: "left"}}>
                        <this.Translate id="text_desc"/>
                      </th>
                      <th style={{fontWeight: 500, width: "20mm", textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)"}}>
                        <this.Translate id="text_amount"/>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" style={{backgroundColor: "white"}} />
                    </tr>
                    {
                      this.props.productList.map((product, index) => 
                        <tr key={index}>
                          <td style={{textAlign: "center", backgroundColor: "white"}}>{product.quantity}</td>
                          <td style={{backgroundColor: "white"}}>{product.name}</td>
                          <td style={{textAlign: "right", backgroundColor: "white"}}>{this.formatCurrency(product.price)}</td>
                        </tr> 
                      )
                    }
                    <tr>
                      <td colSpan="3" style={{backgroundColor: "white"}} />
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{backgroundColor: "white", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 5}} />
                      <td style={{backgroundColor: "white", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 5, textDecoration: "uppercase"}}><this.Translate id="text_sub_total" />:</td>
                      <td style={{backgroundColor: "white", textAlign: "right", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 5}}>{this.formatCurrency(this.props.summaryTotal.subTotalAfterDiscount)}</td>
                    </tr>
                    <tr>
                      <td style={{backgroundColor: "white"}} />
                      <td style={{backgroundColor: "white"}}>
                        <span className="text-uppercase"><this.Translate id="text_tax" /></span> {taxTitle}:
                      </td>
                      <td style={{backgroundColor: "white", textAlign: "right"}}>{this.formatCurrency(this.props.taxAmount)}</td>
                    </tr>
                    <tr>
                      <td style={{backgroundColor: "white"}} />
                      <td style={{backgroundColor: "white", textDecoration: "uppercase"}}><this.Translate id="text_discount"/>:</td>
                      <td style={{backgroundColor: "white", textAlign: "right"}}>{this.formatCurrency(this.props.discountAmount)}</td>
                    </tr>
                    {
                      countTax > 1 ?
                        this.props.productTaxList.map((productTax, productTaxIndex) =>
                          productTax.totalTaxAmount > 0 ?
                            <tr key={productTaxIndex}>
                              <td style={{backgroundColor: "white"}} />
                              <td style={{backgroundColor: "white", paddingLeft: 15}}>
                                {productTax.name}:
                              </td>
                              <td style={{backgroundColor: "white", textAlign: "right"}}>{this.formatCurrency(productTax.totalTaxAmount)}</td>
                            </tr>
                            :
                            ""
                        )
                        :
                        <tr></tr>
                    }
                    <tr>
                      <td colSpan={3} style={{backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)"}} ></td>
                    </tr>
                    {
                      this.props.customerPaymentList.map((customerPayment, customerPaymentIndex) => 
                        <tr key={customerPaymentIndex}>
                          <td style={{backgroundColor: "white", paddingTop: customerPaymentIndex === 0 ? 5 : 0}} />
                          <td style={{backgroundColor: "white", textTransform: "uppercase", paddingTop: customerPaymentIndex === 0 ? 5 : 0}}>{customerPayment.paymentMethodName}:</td>
                          <td style={{backgroundColor: "white", textAlign: "right", paddingTop: customerPaymentIndex === 0 ? 5 : 0}}>{this.formatCurrency(customerPayment.tender)}</td>
                        </tr>
                      )
                    }
                    <tr>
                      <td style={{backgroundColor: "white"}} />
                      <td style={{backgroundColor: "white", textTransform: "uppercase"}}><this.Translate id="text_change"/>:</td>
                      <td style={{backgroundColor: "white", textAlign: "right"}}>{this.formatCurrency(this.props.changeAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white", paddingTop: 60, textTransform: "uppercase"}}><this.Translate id="text_thank_you_on_receipt"/></td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>
                <img id="receiptCarcode" alt="" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}><this.Translate id="text_feedback_keep_on_receipt"/></td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>www.storevein.com</td>
            </tr>
            </tbody></table>
        </div>
      </div>
    );
  }
}

Receipt.defaultProps = {
  receiptTemplate: {
    logo: ""
  }
};
