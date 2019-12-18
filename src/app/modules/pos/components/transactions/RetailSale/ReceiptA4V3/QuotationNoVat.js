import React from "react";
import ReceiptA4V3HaveTax from "./ReceiptA4V3HaveTax";
export default class QuotationNoVat extends ReceiptA4V3HaveTax {

    constructor(props){
        super(props);
        this.rowSpan = 3;
        this.borderTopCustomerInfo = "";
        this.title = "QUOTATION";
    }

    companyInformation(){ 
      return; 
    }

    vatNumber(){ 
      return;
    }

    tax(){ 
        return;  
    }

    customerInfo(){
        return(
          
          <div style={{ paddingTop: "3px", paddingBottom: "3px", fontSize: "12px",borderTop: this.borderTopCustomerInfo, textAlign:"center"}}>
             <table style={{width: "100%", borderCollapse: "collapse"}}>
             <tbody>
                <tr style={{backgroundColor: "white"}}>
                 <td style={{ textAlign: "left", width: "61%",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>TO :</span> { this.props.data.customer.firstName + " " + this.props.data.customer.lastName   }</td>
                 <td style={{ textAlign: "left",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>No : </span></td>
                </tr>
                <tr style={{backgroundColor: "white"}}>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Attn : </span></td>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Date : </span></td>
                </tr>
                <tr style={{backgroundColor: "white"}}>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Phone :</span>{this.props.data.customer.phoneNumber}</td>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Valid Till :  </span></td>
                </tr>
                <tr style={{backgroundColor: "white"}}>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Address :</span> { this.props.data.customer.address ? this.props.data.customer.address : "" }</td>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Validaty : </span></td>
                </tr>
                <tr style={{backgroundColor: "white"}}>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Email : {this.props.data.customer.email}</span></td>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Currency :</span></td>
                </tr>
                <tr style={{backgroundColor: "white"}}>
                  <td style={{ textAlign: "left", fontSize: "12px" }}></td>
                  <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Credit Term :</span> </td>
                </tr>
              </tbody>
             </table>
             {this.vatNumber()}
          </div>
        )
      }

    termAndCondition(){
        return(
            <tr style={{borderTop: "1px solid black", fontSize: "12px"}}>
                <td colSpan={2} rowSpan={this.rowSpan} style={{borderRight: "1px solid black", fontSize: "12px", textAlign: "left", backgroundColor: "white"}}>
                    <div style={{ height: "20px", backgroundColor: "rgb(255, 192, 0)" }}></div>
                    <div style={{ fontWeight: "bold", textDecoration: "underline" }}>GENERAL TERMS & CONDITIONS:</div>
                    <div>
                        1. Validity: Within 15 days after the date of quotation. <br/>
                        2. No warranty for Adapter, avoid of sticker broken and burned.<br/>
                    </div>
                </td>
                <td colSpan={2} style={{ letterSpacing: "1.2px", fontWeight: "bold", fontFamily: "Khmer OS Muol", textAlign: "left", padding: 1, backgroundColor: "rgb(255, 192, 0)", fontSize: "12px"}}>SUBTOTAL :</td>
                <td style={{ borderRight: "1px solid black", padding: 1, backgroundColor: "rgb(255, 192, 0)" }} >
                    {this.renderMoneyCell(this.props.data.total + this.props.data.discount, "$", true, "9pt")}
                </td>
            </tr>
        );
    }

    textButtomTermAndCondition(){
        return(
            <div style={{ textAlign: "left", fontSize: "12px" }}>
                  3. Payment Term: <br/>
                <ul style={{ listStyle: "none", marginBottom: "3px", marginTop: "-3px" }}>
                    <li>- 50% deposit after PO confirmation.</li>
                    <li>- 30% after product delivery on site.</li>
                    <li>- 20% after implementation complete.</li>
                </ul>
                <div style={{ width: "433px", marginBottom: "10px" }}>
                    4. All the price above are in US Dollars and exclude Tax 10%.<br/>
                    5. Delivery 1-2 working days in stock or 9 weeks out of stock depending on shipping schedule from Confirmed order.<br/>
                    6. Cancellation: In case, the PO is cancelled after confirmation, full payment must be honored by the customer.<br/>
                    7. Please kindly sign the quotation and send back as an order confirmation.<br/>
                </div>
                <div style={{ textAlign: "left", fontSize: "12px", fontWeight: "bold" }}>*Good Sold are not returable and received in good condition.</div>
                <div style={{ textAlign: "left", fontSize: "12px", fontWeight: "bold" }}>*We look forward to hearing from you.</div>
            </div>
        );
    }
}

