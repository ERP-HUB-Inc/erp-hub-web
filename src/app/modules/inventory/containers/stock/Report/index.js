import React from "react";
import Component from "../../../components/Component";

class Report extends Component {

  render() {
    return (
      <div className="main-report" id="print-invoice-content" style={{ width: "100%",margin: "0 auto", backgroundColor: "white", padding: "13px 34px" }}>

        <table style={{ width: "100%", marginBottom: "5px" }}>
          <tr style={{ backgroundColor: "white" }}>
            <td style={{ width: "50%" }}>
              <span style={{ fontSize: "70px" }} className="icon-logo"></span>
            </td>
            <td style={{ fontSize: "23px",textDecoration: "underline" }}>
                Purchase Order Report
            </td>
          </tr>
        </table>

        <table style={{ width: "100%", marginBottom: "5px", color: "#848181", fontSize: "14px", lineHeight: "27px" }}>     
          <tr style={{ background: "white" }}>
            <td style={{ width: "50%" }}>Po No:</td>
            <td>Supplier Name:</td>
          </tr>
          <tr>
            <td>Title:</td>
            <td>Supplier Invoice:</td>
          </tr>
          <tr style={{ background: "white" }}>
            <td>Date:</td>
            <td>Delivery Date:</td>
          </tr>
          <tr>
            <td>Employee:</td>
            <td>Receive Location:</td>
          </tr>
          <tr style={{ background: "white" }}>
            <td>Ref. Po No:</td>
          </tr>
        </table>

        <table style={{ width: "100%", color: "#848181" }}>
          <tr style={{ background: "white", width: "100%", borderBottom: "1px solid #ecebeb", color: "rgb(132, 129, 129);" }}>
            <td style={{ padding: "8px" }}>No</td>
            <td>Product Description</td>
            <td>Price</td>
            <td>Order QTY</td>
            <td>Receive QTY</td>
            <td style={{ textAlign: "right" }}>Order Amount</td>
            <td style={{ textAlign: "right" }}>Received Amount</td>
          </tr>
          <tr style={{ fontSize: "13px", background: "white" }}>
            <td style={{ padding: "8px" }}>1</td>
            <td>Vasaline man</td>
            <td>200$</td>
            <td>12</td>
            <td>12</td>
            <td style={{ textAlign: "right" }}>34</td>
            <td style={{ textAlign: "right" }}>90</td>
          </tr>
          <tr style={{ fontSize: "13px", background: "white" }}>
            <td style={{ padding: "8px" }}>2</td>
            <td>Vasaline man</td>
            <td>200$</td>
            <td>12</td>
            <td>12</td>
            <td style={{ textAlign: "right" }}>34</td>
            <td style={{ textAlign: "right" }}>90</td>
          </tr>
          <tr style={{ backgroundColor:"#ECEBEB",width: "100%", padding: "8px" }}>
            <td colSpan="4" style={{ color: "black", textAlign: "right", background: "white" }} ></td>
            <td style={{ padding: "8px" }}>Total</td>
            <td style={{ textAlign: "right" }}>300 $</td>
            <td style={{ textAlign: "right" }}>200 $</td>
          </tr>
        </table>            
      </div>

    );
  }
}


export default Report;