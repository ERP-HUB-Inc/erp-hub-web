import React from "react";
import ReceiptA4V3HaveTax from "./ReceiptA4V3HaveTax";
export default class QuotationNoVat extends ReceiptA4V3HaveTax {

    constructor(props){
        super(props);
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
      let customer = this.props.data.customer;
      if (!customer) {
        customer = {};
      }
      return <div style={{ paddingTop: "3px", paddingBottom: "3px", fontSize: "12px",borderTop: this.borderTopCustomerInfo, textAlign:"center"}}>
            <table style={{width: "100%", borderCollapse: "collapse"}}>
            <tbody>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", width: "61%",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>TO :</span> { customer.firstName + " " + customer.lastName   }</td>
                <td style={{ textAlign: "left",fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>No : </span></td>
              </tr>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Attn : </span></td>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Date : </span></td>
              </tr>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Phone :</span>{customer.phoneNumber}</td>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Valid Till :  </span></td>
              </tr>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Address :</span> { customer.address ? customer.address : "" }</td>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Validaty : </span></td>
              </tr>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Email : {customer.email}</span></td>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Currency :</span></td>
              </tr>
              <tr style={{backgroundColor: "white"}}>
                <td style={{ textAlign: "left", fontSize: "12px" }}></td>
                <td style={{ textAlign: "left", fontSize: "12px" }}><span style={{ fontWeight: "bold" }}>Credit Term :</span> </td>
              </tr>
            </tbody>
            </table>
            {this.vatNumber()}
        </div>;
    }

}

