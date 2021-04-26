import React from "react";
import Component from "../../../../../common/components/Component";

export default class PO extends Component {
  render() {
    const paddingLine = {padding: "15px 0", background: "white"};
    const styleHeader = {fontSize: "13px", background: "white"};
    const paddingHeader = {padding: "2px 0"};
    const {supplier, employee, location} = this.props.data;
    let logo = "example.jpg";
    const currentSetting = this.Util.getSetting();
    if (currentSetting) {
      logo = currentSetting.logo;
    }
    return (
      <div  id="po-email-template" style={{display: "none"}}>
        <table style={{width: "100%", backgroundColor: "whitesmoke"}}>
          <tbody>
            <tr>
              <td style={{paddingTop: "15px", paddingBottom: "15px", paddingLeft: "15px", paddingRight: "15px"}}>
                <table style={{maxWidth: "297mm", marginBottom: "5px", margin: "auto", backgroundColor: "white", paddingTop: "10px", paddingBottom: "10px", paddingLeft: "15px", paddingRight: "15px"}}>
                  <tbody>
                    <tr style={{ backgroundColor: "white" }}>
                      <td colSpan="3" style={{textAlign: "left"}}>
                        <img
                          src={this.Util.getProductImage(logo, "general").url}
                          alt="" style={{width: "70px"}}/>
                      </td>
                      <td colSpan="1"></td>
                      <td colSpan="3" style={{ fontSize: "30px", fontWeight: "600",  position: "relative", overflow: "hidden" }}>
                        <div style={{color: "rgb(134, 129, 129)", textTransform: "uppercase"}}>{<this.Translate id="text_po"/>}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style={paddingLine} colSpan="7"></td>
                    </tr>
                    <tr>
                      <td bgcolor="#F7F7F7" colSpan="3" style={{padding: "5px 10px", fontSize: "13px", textTransform: "uppercase"}}>
                        {<this.Translate id="text_company"/>}
                      </td>
                      <td colSpan="1" style={{backgroundColor: "white"}}>
                      </td>
                      <td bgcolor="#F7F7F7" colSpan="3" style={{padding: "5px 10px", fontSize: "13px", textTransform: "uppercase"}}>
                        {<this.Translate id="text_supplier"/>}
                      </td>
                    </tr>
                    <tr style={styleHeader}>
                      <td colSpan="3" style={{paddingBottom: "5px"}}>{<this.Translate id="text_po_no"/>}: {this.props.data.number}</td>
                      <td></td>
                      <td colSpan="3" style={{paddingBottom: "5px"}}>{<this.Translate id="text_name" />}: {supplier.name}</td>
                    </tr>
                    <tr style={styleHeader}>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_title" />}: {this.props.data.name}</td>
                      <td></td>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_invoice" />}: {this.props.data.invoiceNo}</td>
                    </tr>
                    <tr style={styleHeader}>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_date" />}: {this.Util.formatDate(this.props.data.createAt)}</td>
                      <td></td>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_diliver_date"/>}: {this.Util.formatDate(this.props.data.deliveryDueDate)}</td>
                    </tr>
                    <tr style={styleHeader}>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_employee"/>}: {employee.fullName}</td>
                      <td></td>
                      <td colSpan="3" style={paddingHeader}>{<this.Translate id="text_receive_location"/>}: {location.name}</td>
                    </tr>
                    <tr style={styleHeader}>
                      <td colSpan="7" style={paddingHeader}>{<this.Translate id="text_ref_po_no"/>}: {this.props.data.referenceNumber ? this.props.data.referenceNumber : this.emptyText}</td>
                    </tr>
                    <tr>
                      <td style={paddingLine} colSpan="7"></td>
                    </tr>
                    <tr style={{width: "100%", color: "rgb(132, 129, 129)" }}>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", fontSize: "13px", width: "30px", borderBottom: "1px dashed #ecebeb"}}>{<this.Translate id="text_no"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", fontSize: "13px", borderBottom: "1px dashed #ecebeb"}}>{<this.Translate id="text_product_description"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", width: "80px", fontSize: "13px", borderBottom: "1px dashed #ecebeb"}}>{<this.Translate id="text_price"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", width: "80px", fontSize: "13px", borderBottom: "1px dashed #ecebeb"}}>{<this.Translate id="text_order_qty"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", width: "85px", fontSize: "13px", borderBottom: "1px dashed #ecebeb"}}>{<this.Translate id="text_receive_qty"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", width: "100px", textAlign: "right", fontSize: "13px",borderBottom: "1px dashed #ecebeb" }}>{<this.Translate id="text_order_amount"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "7px", width: "120px", textAlign: "right", fontSize: "13px",borderBottom: "1px dashed #ecebeb" }}>{<this.Translate id="text_receive_amount"/>}</td>
                    </tr>
                    {
                      this.props.data.POEntries.map((value, key) => 
                        <tr style={{fontSize: "13px", background: "white"}} key={key}>
                          <td style={{padding: "5px"}}>{key + 1}</td>
                          <td style={{padding: "5px"}}>
                            <div>{value.productName}</div>
                            <div style={{fontSize: "7.5pt", marginTop: "2px"}}>{value.variantName}</div>
                          </td>
                          <td style={{padding: "5px"}}>{this.formatCurrency(value.price)}</td>
                          <td style={{padding: "5px"}}>{value.requestQuantity}</td>
                          <td style={{padding: "5px"}}>{value.receiveQuantity ? value.receiveQuantity : 0}</td>
                          <td style={{padding: "5px", textAlign: "right"}}>{this.formatCurrency(value.price * value.requestQuantity)}</td>
                          <td style={{padding: "5px", textAlign: "right"}}>{this.formatCurrency(0)}</td>
                        </tr>       
                      )
                    }
                    <tr style={{backgroundColor:"rgb(247, 247, 247)", width: "100%", padding: "8px" }}>
                      <td colSpan="4" style={{ color: "black", textAlign: "right", background: "white", borderTop: "1px dashed rgb(236, 235, 235)" }} ></td>
                      <td style={{padding: "5px", borderTop: "1px dashed rgb(236, 235, 235)"}}>{<this.Translate id="text_total"/>}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "5px", textAlign: "right", borderTop: "1px dashed rgb(236, 235, 235)"}}>{this.formatCurrency(this.props.data.requestTotal)}</td>
                      <td bgcolor="#F7F7F7" style={{padding: "5px", textAlign: "right", borderTop: "1px dashed rgb(236, 235, 235)"}}>{this.formatCurrency(this.props.data.receiveTotal ? this.props.data.receiveTotal : 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}