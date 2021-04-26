import React from "react";
import ReactHtml from "raw-html-react";
import Component from "../../../../common/components/Component";
import "./ReceiptA4.css";
export default class ReceiptA4 extends Component {
  constructor(props) {
    super(props);
    this.title = "វិក័យប័ត្រ / INVOICE";
    this.issuedBy = "អ្នកចេញវិក័យប័ត្រ​​ / Issued by";
    this.isQuotation = false;
  }
  renderLogo(){
    return(
      <div style={{position: "relative", margin: "0 auto"}}>
        <img style={{width: 100}} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url} />
      </div>
    )
  }

  companyInfo(){
    return(
      <div style={{padding: "8px", fontSize: "11px", marginBottom: "15px", borderBottom: "1px solid black", borderTop: "1px solid black", textAlign:"center", marginTop: "10px"}}>
          <div className="wrap-company-address">
            <ReactHtml html={this.props.data.client.address} />
          </div>
          <div>Tel: <span style={{textDecoration: "underline"}}>{this.props.data.client.phoneNumber}</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;Email: <span style={{textDecoration: "underline"}}>{this.props.data.client.email} </span></div>
      </div>
    )
  }

  customerInfo(){
    return(
      <div style={{textAlign: "left", border: "1px solid black", backgroundColor: "#FCE4D6", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
        <div style={{ fontWeight: "bold", letterSpacing: "1.2px" }}>ព័ត៌មានអតិថិជន Customer Information:</div>
          {
            this.props.data.customer ?
          <div style={{ marginTop: 10 }}>
            <div style={{fontWeight: "bold"}}>{ this.props.data.customer.company }</div>
            { this.props.data.customer.address ? this.props.data.customer.address : "" }  
           <div> Tel: {this.props.data.customer.phoneNumber} |  Email: {this.props.data.customer.email}</div>
          </div> : "" }
      </div>
    )
  }

  renderMoneyCell(value = 0, symbol, isBold = false, fontSize = "8.5pt") {
    return <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <div style={{ fontSize, fontWeight: isBold ? "600" : "400" }}>{symbol ? symbol : "$" }</div>
      <div style={{ fontSize, fontWeight: isBold ? "600" : "400" }}>{this.formatCurrency(value, "", false)}</div>
    </div>;
  }


  itemlist() {
    return this.props.productList.map((product, index) => 
      <tr style={{borderLeft: "1px solid black"}} key={index}>
        <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "12px", verticalAlign: "top",  padding: 5}}>{ index + 1 }</td>
        <td style={{ borderRight: "1px solid black", width: "420px", fontSize: "8.5pt", textAlign: "left", padding: 5, verticalAlign: "middle" }}>
          <div>
            <span style={{ fontWeight: "bold", fontSize: "9.5pt", fontFamily: "Khmer OS Content"  }}>{product.name}</span>
            <div style={{ fontSize: "7px", fontFamily: "Khmer OS Content" }}>
            { product.variantName ? product.variantName : "" }
            </div>
            <pre style={{ fontSize: "8.5pt", fontFamily: "Khmer OS Content", overflow: "hidden", marginTop: 0, marginBottom: 0 }}>{product.productDescription}</pre>
          </div>
        </td>
        <td style={{ borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "8.5pt", padding: 5, verticalAlign: "middle" }}>{product.quantity} {product.unit ? product.unit.name : ""}</td>
        <td style={{ borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "8.5pt", padding: 5, verticalAlign: "middle" }}>{this.renderMoneyCell(this.formatCurrency(product.price,"",false))}</td>
        <td style={{ borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "8.5pt", padding: 5, verticalAlign: "middle" }}>{this.renderMoneyCell(product.price * product.quantity)}</td>
      </tr>
    );
  }

  render() {
    return (
      <div id="pos-receipt-preview" style={{textAlign: "center", width: "705px", margin: "auto", fontFamily: "Khmer OS Content", display: "block", pageBreakBefore: "always"}}>
        <div style={{display: "flex", fontSize: "11px"}}>
          <div style={{flexGrow: 2, textAlign: "left"}}>
              {this.renderLogo()}
          </div>
          <div style={{ flexGrow: 2, fontSize: "18pt", fontWeight: "bold", fontFamily: "Khmer OS Muol", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span>{this.props.data.client.businessName}</span><br />
          </div>
        </div>
        {this.companyInfo()}
        <div style={{fontSize: "23px",textAlign:"center",fontWeight: "bold", fontFamily: "Khmer OS Muol", color: "red"}}>
          {this.title}
        </div>
        <div style={{ display: "flex", fontSize: "11px", marginBottom: "8px", alignItems: "flex-end" }}>
          <div style={{flexGrow: 2, textAlign: "left", letterSpacing: "1.2px"}}>កាលបរិច្ឆេទ Date: <span style={{fontWeight: "bold"}}>{this.Util.formatDate(this.props.data.createdAt, "DD/MMM/YYYY")}</span></div>
          {this.Util.getClientVATNo() && !this.isQuotation ? <div style={{ flexGrow: 2, textAlign: "left", letterSpacing: "1.2px" }}>VAT IN: {this.Util.getClientVATNo() }</div> : ""}
          <div style={{ flexGrow: 2, textAlign: "right", letterSpacing: "1.2px" }}>លេខ No: <span style={{fontWeight: "bold", color: "#CC0000", fontSize: "10.5pt"}}>{this.props.data.number}</span></div>
        </div>

        {this.customerInfo()}
        
        <table style={{width: "100%", fontFamily: "Khmer OS Content", marginBottom: "23px", borderCollapse: "collapse"}}>
          <tbody><tr style={{backgroundColor: "red"}}>
              <th style={{color: "white", border: "1px solid black", fontSize: "11pt"}}>លរ <br /> No</th>
              <th style={{color: "white", border: "1px solid black", fontSize: "11pt"}}>បរិយាយ​<br />Description</th>
              <th style={{color: "white", border: "1px solid black", fontSize: "11pt"}}>បរិមាណ<br />Quantity</th>
              <th style={{color: "white", border: "1px solid black", fontSize: "11pt", width: "160px"}}>តំលៃ<br />Unit Price</th>
              <th style={{color: "white", border: "1px solid black", fontSize: "11pt", width: "160px"}}>សរុប<br />Total</th>
            </tr>
            {this.itemlist()}
            {/* <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr> */}
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} rowSpan={4} style={{borderRight: "1px solid black", backgroundColor: "#E7E6E6", fontSize: "11px", padding: "8px", textAlign: "left"}}>
                <ReactHtml html={this.Util.getClientPaymentTerm()} />
              </td>
              <td colSpan={2} style={{ letterSpacing: "1.2px", borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left", padding: 5}}>សរុប Total </td>
              <td style={{ borderRight: "1px solid black", padding: 5 }} >
                {this.renderMoneyCell(this.props.data.total + this.props.data.discount, "$", true, "9pt")}
              </td>
            </tr>
            {/* <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>អាករ VAT 0% </td>
              <td style={{borderRight: "1px solid black"}}>
              {this.renderMoneyCell()}
              </td>
            </tr> */}

            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{ letterSpacing: "1.2px", borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left", padding: 5}}>
                បញ្ចុះតំលៃ Discount ({this.props.data.terms ? this.props.data.terms : 0}  %)
              </td>
              <td style={{ borderRight: "1px solid black", padding: 5 }}>
              {this.renderMoneyCell(this.props.data.discount, "$", true, "9pt")}
              </td>
            </tr>

            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{ letterSpacing: "1.2px", borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left", padding: 5}}>សរុបរួម Grand Total </td>
              <td style={{ borderRight: "1px solid black", padding: 5 }}>
                {this.renderMoneyCell(this.props.data.total, "$", true, "9pt")}
              </td>
            </tr>
          </tbody></table> 
        <div style={{position: "relative", top: "25px"}}>
          <div style={{display: "flex", fontSize: "11px", marginTop: "8px", marginBottom: "8px"}}>
            <div style={{ flexGrow: 2, textAlign: "left" }}>{this.issuedBy} ..............</div>
            <div style={{flexGrow: 2, textAlign: "right"}}>អតិថិជន ​/ Customer ..............</div>
          </div>
          <div style={{textAlign: "center", backgroundColor: "#F8CBAD", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
            <div style={{ fontFamily: "Khmer OS" }}><span style={{fontWeight: "bold"}}>ចំណាំ៖ </span>&nbsp;ច្បាប់ដើមសម្រាប់​អ្នកទិញ និង ​ច្បាប់​ចម្លង​សម្រាប់​អ្នក​លក់</div>
          </div>
          <div style={{textAlign: "center", fontSize: "11px", marginBottom: "15px"}}>
            <div style={{ letterSpacing: "1.2px", fontWeight: "bold" }}>សូមអំណរគុណ​សំរាប់​គាំទ្រដល់​សេវាកម្ម​យើង​ខ្ញុំ‌‌!    <i>Thank you for support our service!</i></div>
          </div>
        </div> 
      </div>
    );
  }
}

ReceiptA4.defaultProps = {
  receiptTemplate: {
    logo: ""
  },
};
