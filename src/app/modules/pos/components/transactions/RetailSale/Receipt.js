import React from "react";
import JsBarcode from "jsbarcode";
import Component from "../../../../common/components/Component";
export default class Receipt extends Component {
  componentDidMount() {
    JsBarcode("#receiptCarcode", this.props.data.receiptNumber, {
      height: 35,
      displayValue: false
    });
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
    return (
      <div style={{display: "none"}} id="pos-receipt-preview">
        <div style={{
          padding: "15px 15px",
          backgroundColor: "white",
          margin: "0 auto",
          fontFamily: "Arial"
        // display: "none"
        }}>
          <table width="100%" style={{color: "rgb(142, 136, 136)", fontSize: "9pt", backgroundColor: "white", margin: "auto"}}>
            <tbody><tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>
                <div style={{height: 100, width: 100, border: "1px solid rgb(142, 136, 136)", position: "relative", borderRadius: 100, margin: "auto", overflow: "hidden"}}>
                  <img alt="" src="http://ca.localhost:3081/store-logo.PNG" style={{position: "absolute", left: 0, right: 0, bottom: 0, top: 0, margin: "auto"}} />
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
              <td style={{backgroundColor: "white", textAlign: "left", paddingTop: 30}}>Register No. {this.props.data.number}</td>
              <td style={{backgroundColor: "white", textAlign: "right", paddingTop: 30}}>Date: {this.Util.formatDate(this.props.data.createdAt, "DD MMMM YYYY h:mm A")}</td>
              {/* 12 June 2018 11:30 AM */}
            </tr>
            <tr>
              <td style={{backgroundColor: "white", textAlign: "left"}}>Receipt No. {this.props.data.receiptNumber}</td>
              <td style={{backgroundColor: "white", textAlign: "right"}}>Cashier: {cashier}</td>
            </tr>
            <tr>
              <td colSpan={2} style={{paddingTop: 10}}>
                <table width="100%" style={{fontSize: "9pt", color: "rgb(142, 136, 136)"}}>
                  <thead>
                    <tr>
                      <th style={{fontWeight: 500, width: 50, textAlign: "center", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)"}}>QTY</th>
                      <th style={{fontWeight: 500, padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)", textAlign: "left"}}>DESC</th>
                      <th style={{fontWeight: 500, width: 100, textAlign: "right", padding: "5px 0px", backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)"}}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" style={{backgroundColor: "white", paddingBottom: 10}} />
                    </tr>
                    {
                      this.props.productList.map((product, index) => 
                        <tr key={index}>
                          <td style={{textAlign: "center", backgroundColor: "white"}}>{product.quantity}</td>
                          <td style={{backgroundColor: "white"}}>{product.name}</td>
                          <td style={{textAlign: "right", backgroundColor: "white"}}>{this.Util.formatCurrency(product.price)}</td>
                        </tr> 
                      )
                    }
                    <tr>
                      <td colSpan="3" style={{backgroundColor: "white", paddingTop: 10}} />
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{backgroundColor: "white", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 10}} />
                      <td style={{backgroundColor: "white", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 10}}>SUB TOTAL:</td>
                      <td style={{backgroundColor: "white", textAlign: "right", borderTop: "1px dashed rgb(212, 203, 203)", paddingTop: 10}}>{this.Util.formatCurrency(this.props.summaryTotal.subTotalAfterDiscount)}</td>
                    </tr>
                    <tr>
                      <td style={{backgroundColor: "white"}} />
                      <td style={{backgroundColor: "white"}}>DISCOUNT:</td>
                      <td style={{backgroundColor: "white", textAlign: "right"}}>{this.Util.formatCurrency(this.props.discountAmount)}</td>
                    </tr>
                    <tr>
                      <td style={{backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)", paddingBottom: 10}} />
                      <td style={{backgroundColor: "white", borderBottom: "1px dashed rgb(212, 203, 203)", paddingBottom: 10}}>TAX {this.props.taxRate > 0 ? `(${this.props.taxRate}%)` : <this.Translate id="text_no_tax"/>}:</td>
                      <td style={{backgroundColor: "white", textAlign: "right", borderBottom: "1px dashed rgb(212, 203, 203)", paddingBottom: 10}}>{this.Util.formatCurrency(this.props.taxAmount)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} style={{paddingTop: 5, backgroundColor: "white"}} />
                    </tr>
                    {
                      this.props.customerPaymentList.map((customerPayment, customerPaymentIndex) => 
                        <tr key={customerPaymentIndex}>
                          <td style={{backgroundColor: "white"}} />
                          <td style={{backgroundColor: "white", textTransform: "uppercase"}}>{customerPayment.paymentMethodName}:</td>
                          <td style={{backgroundColor: "white", textAlign: "right"}}>{this.Util.formatCurrency(customerPayment.tender)}</td>
                        </tr>
                      )
                    }
                    <tr>
                      <td style={{backgroundColor: "white"}} />
                      <td style={{backgroundColor: "white"}}>CHANGE:</td>
                      <td style={{backgroundColor: "white", textAlign: "right"}}>{this.Util.formatCurrency(this.props.changeAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white", paddingTop: 60}}>THANK YOU FOR CHOOSING US !</td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>
                <img id="receiptCarcode" alt="" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{textAlign: "center", backgroundColor: "white"}}>YOUR FEEDBACK KEEPS US IMPROVING!</td>
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
