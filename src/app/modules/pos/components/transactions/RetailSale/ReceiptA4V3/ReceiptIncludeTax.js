import React from "react";
import ReactHtml from "raw-html-react";
import Component from "../../../../../common/components/Component";
export default class ReceiptIncludeTax extends Component {
  constructor(props) {
    super(props);
    this.title = "INVOICE";
    this.rowSpan = 5;
    this.borderTopCustomerInfo = "1px solid black";
  }

  customerInfo(){
    let customer = this.props.data.customer;

    if (!customer) {
      customer ={};
    }
    return(
      <div className="main-customer" style={{ paddingTop: "3px", paddingBottom: "3px", fontSize: "12px", borderTop: this.borderTopCustomerInfo, textAlign:"center", lineHeight: "15px"}}>
         <table style={{width: "100%", borderCollapse: "collapse"}}>
        
         <tbody>
            <tr style={{backgroundColor: "white"}}>
             <td style={{ textAlign: "left", width: "61%",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>TO :</span> { customer.firstName + " " + customer.lastName   }</td>
             <td style={{ textAlign: "left",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Invoice No : </span> {this.props.data.receiptNumber ? this.props.data.receiptNumber : this.props.data.number}</td>
            </tr>
            <tr style={{backgroundColor: "white"}}>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Attn : </span>N/A</td>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Date : </span> {this.Util.formatDate(this.props.data.createdAt, "DD MMM YYYY h:mm A")}</td>
            </tr>
            <tr style={{backgroundColor: "white"}}>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Phone :</span> {customer.phoneNumber}</td>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Currency :</span> {this.props.data.defaultCurrency ? this.props.data.defaultCurrency.symbol : ""}</td>
            </tr>
            <tr style={{backgroundColor: "white"}}>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Address :</span> { customer.address ? customer.address : "" }</td>
              <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Sale Rep : </span>{ this.props.data.referenceNo ? this.props.data.referenceNo : "N/A" }</td>
            </tr>
            <tr style={{backgroundColor: "white"}}>
              <td style={{ textAlign: "left", fontSize: "12px" }}><b>Email :</b> {customer.email}</td>
              <td style={{ textAlign: "left", fontSize: "12px" }}></td>
            </tr>
          </tbody>
         </table>

         {this.vatNumber()}

      </div>
    )
  }

  companyInformation(){
    return(
      <div className="main-customer">
           <table style={{width: "50%", fontFamily: "Khmer OS Content", borderCollapse: "collapse"}}>
            <tbody>
              <tr style={{ backgroundColor: "white" }}>
                <td valign="top"  style={{ textAlign: "left", fontWeight: "bold", fontSize: "12px", width: "60px" }}>Address :</td>
                <td style={{ textAlign: "left",fontSize: "12px" }}> <ReactHtml html={this.props.data.client.address} /></td>
              </tr>
              <tr style={{ backgroundColor: "white" }}>
                <td colSpan={2} style={{ textAlign: "left", fontWeight: "bold", fontSize: "12px" }}>Phone : { this.props.data.client.phoneNumber }</td>
              </tr>
              <tr style={{ backgroundColor: "white" }}>
                <td colSpan={2} style={{ textAlign: "left", fontWeight: "bold", fontSize: "12px" }}>Email : {this.props.data.client.email}</td>
              </tr>
            </tbody>
        </table>
      </div>
    );
  }

  tax(){
    return(
      <tr style={{border: "1px solid black", backgroundColor: "rgb(255, 192, 0)", fontSize: "12px"}}>
        <td colSpan={2} style={{ letterSpacing: "1.2px", borderLeft: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", textAlign: "left", padding: 3, fontSize: "12px"}}>TAX :</td>
        <td style={{ borderRight: "1px solid black" }}>
            {this.renderMoneyCell(this.props.data.taxAmount, "$", true, "9pt")}
        </td>
      </tr>
    );
  }

  discount(){
    return(
      <tr style={{border: "1px solid black", backgroundColor: "rgb(255, 192, 0)", fontSize: "12px"}}>
        <td colSpan={2} style={{ letterSpacing: "1.2px", borderLeft: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", textAlign: "left", fontSize: "12px"}}>
          DISCOUNT :
        </td>
        <td style={{ borderRight: "1px solid black",fontSize: "12px" }}>
          {this.renderMoneyCell(this.props.data.discount, "$", true, "9pt")}
        </td>
    </tr>
    )
  }

  vatNumber(){
    return(
    <div style={{ backgroundColor: "rgb(231, 230, 230)", textAlign: "left", padding: "1px", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>VAT Number:</span> {this.Util.getClientVATNo()}</div>
    );
  }

  renderMoneyCell(value = 0, symbol, isBold = false, fontSize = "8.5pt") {
    return <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <div style={{ fontSize, fontWeight: isBold ? "600" : "400" }}>{symbol ? symbol : "$" }</div>
      <div style={{ fontSize, fontWeight: isBold ? "600" : "400" }}>{this.formatCurrency(value, "", false)}</div>
    </div>;
  }

  termAndCondition(){
    return(
      <tr style={{borderTop: "1px solid black", fontSize: "12px"}}>
            <td colSpan={2} rowSpan={this.rowSpan} style={{textAlign: "left", backgroundColor: "white", verticalAlign: "top", height: "200px" }}>
              <div style={{ height: "20px", backgroundColor: "rgb(255, 192, 0)", width: "100%" }}>
                <span style={{ borderLeft: "1px solid black",position: "relative", height: "25px", float: "right", marginRight: "-2px", marginTop: "-2px"  }}></span>
              </div>
              <ReactHtml html={this.Util.getClientPaymentTerm()} />
            </td>
            <td colSpan={2} style={{ letterSpacing: "1.2px",  fontWeight: "bold", fontFamily: "Khmer OS Muol", textAlign: "left", padding: 1, backgroundColor: "rgb(255, 192, 0)", fontSize: "12px"}}>
             SUBTOTAL :
            </td>
            <td style={{ borderRight: "1px solid black",  padding: 1, backgroundColor: "rgb(255, 192, 0)" }} >
              {this.renderMoneyCell(this.props.data.total + this.props.data.discount, "$", true, "9pt")}
            </td>
      </tr>
    );
  }


  itemlist() {
    return this.props.productList.map((product, index) => 
      <tr style={{borderLeft: "1px solid black", borderBottom: "1px solid black"}} key={index}>
        <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "12px", verticalAlign: "top",  padding: 6}}>{ index + 1 }</td>
        <td style={{ borderRight: "1px solid black", width: "420px", fontSize: "8.5pt", textAlign: "left", padding: 6, verticalAlign: "middle" }}>
          <div>
            <span style={{ fontWeight: "bold", fontSize: "9.5pt", fontFamily: "Khmer OS Content"  }}>{product.name}</span>
            <div style={{ fontSize: "7px", fontFamily: "Khmer OS Content" }}>
            { product.variantName ? product.variantName : "" }
            </div>
            <pre style={{ fontSize: "8.5pt", fontFamily: "Khmer OS Content", overflow: "hidden", marginTop: 0, marginBottom: 0 }}>{product.productDescription}</pre>
          </div>
        </td>
        <td style={{ borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "8.5pt", padding: 6, verticalAlign: "middle" }}>{product.quantity} {product.unit ? product.unit.name : ""}</td>
        <td style={{ borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "8.5pt", padding: 6, verticalAlign: "middle" }}>{this.renderMoneyCell(this.formatCurrency(product.price,"",false))}</td>
        <td style={{ borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "8.5pt", padding: 6, verticalAlign: "middle" }}>{this.renderMoneyCell(product.price * product.quantity)}</td>
      </tr>
    );
  }

  render() {
    return (
      <div id="pos-receipt-preview" style={{textAlign: "center", width: "705px", margin: "auto", fontFamily: "Khmer OS Content", display: "block", pageBreakBefore: "always"}}>
        <div style={{display: "flex", fontSize: "12px"}}>
          <div style={{ flexGrow: 2, fontSize: "40px", fontWeight: "bold", fontFamily: "Franklin Gothic Demi Cond", display: "flex", textAlign: "left", textDecoration: "underline" }}>
            <span>{this.title}</span><br />
          </div>
        </div>
      
         <style>
              {`@media print { 
                table tr td p { line-height: 8px; }, 
                table tr td strong { font-weight: bold; }, 
                .employee-signature { line-height: "17px" }, 
              
                .main-customer table tr td, .main-customer, .main-customer table tr td p { line-height: 15px; },
                .main-address { display: "block" }
                .main-customer .company-address, .main-customer .company-address div { float: "left" }
                
              }`}
          </style>  

        {this.companyInformation()}

        {this.customerInfo()}
        
        <table style={{width: "100%", fontFamily: "Khmer OS Content", borderCollapse: "collapse"}}>
          
          <tbody>
            <tr style={{backgroundColor: "#FFC000"}}>
              <td style={{border: "1px solid black", fontSize: "12px", padding: "1px"}}>NO#</td>
              <td style={{border: "1px solid black", fontSize: "12px", width: "650px", padding: "1px"}}>DESCRIPTION</td>
              <td style={{border: "1px solid black", fontSize: "12px", width: "14px", padding: "1px", textAlign: "center"}}>QTY</td>
              <td style={{border: "1px solid black", fontSize: "12px", width: "135px", padding: "1px", textAlign: "center"}}>UNIT PRICE</td>
              <td style={{border: "1px solid black", fontSize: "12px", width: "135px", padding: "1px", textAlign: "center"}}>AMOUNT</td>
            </tr>

            {this.itemlist()}

            {this.termAndCondition()}

            {this.discount()}

            {this.tax()}

            <tr style={{border: "1px solid black", backgroundColor: "rgb(255, 192, 0)", fontSize: "12px"}}>
              <td colSpan={2} style={{ letterSpacing: "1.2px", borderLeft: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", textAlign: "left", fontSize: "12px"}}>TOTAL :</td>
              <td style={{ borderRight: "1px solid black" }}>
                {this.renderMoneyCell(this.props.data.total + this.props.data.discount, "$", true, "9pt")}
              </td>
            </tr>
          </tbody>
        </table> 
      
        <div style={{ marginTop: "40px" }}>
          <div style={{ width: "60%", textAlign: "left", float: "left", fontSize: "12px", fontWeight: "bold" }}>
            <div style={{ fontWeight: "bold", borderBottom: "1px solid black", lineHeight: "14px", width: "263px" }}>
              <span style={{ marginRight: "75px" }}><strong>Date:</strong></span><span style={{ marginRight: "75px" }}>/</span><span style={{ marginRight: "75px" }}>/</span>
            </div> 
            <div style={{ width: "263px", textAlign: "center" }}><strong>Customer's Signature</strong></div>
          </div>
          <div style={{ width: "40%", textAlign: "left", float: "right", fontSize: "12px", fontWeight: "bold" }}>
            <div style={{ fontWeight: "bold", borderBottom: "1px solid black", lineHeight: "14px" }}>
              <span style={{ marginRight: "75px" }}><strong>Date:</strong></span><span style={{ marginRight: "75px" }}>/</span><span style={{ marginRight: "75px" }}>/</span>
            </div> 
            <div className="employee-signature" style={{ width: "263px", textAlign: "center", lineHeight: "17px" }}>
              <strong>Employee's Signature</strong><br/>
              {this.props.data.client.businessName}<br/>
              {this.props.data.client.phoneNumber}
            </div>
          </div>
        </div>

      </div>
    );
  }
}
