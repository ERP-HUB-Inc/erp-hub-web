import React from "react";
import Util from "../../../../../common/util";

const DeliveryNote = React.forwardRef((props, ref) => {

  const util = new Util();
  const setting = util.getSetting();

  const {formData} = props.formData ? props : DeliveryNote.defaultProps;
  let invoice = {};

  if (Array.isArray(formData.invoices)) {
    invoice = formData.invoices.find(value => value);
  }

  return (
    <div ref={ref} style={{width: "250mm", margin: "auto", minHeight: "297mm", background: "white"}}>
      <table style={{width: "100%", marginBottom: 50}}>
        <tbody>
          <tr style={{background: "none"}}>
            <td style={{textAlign: "left"}}>
              <img src={util.getGeneralImage(`${formData.clientId}/general/${formData.client ? formData.client.logo : ""}`).url} alt="Logo" style={{height: 140}} />
            </td>
            <td style={{textAlign: "right", verticalAlign: "top"}}>
              <h1 style={{textTransform: "uppercase", fontWeight: "bold"}}>Delivery Note</h1>
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{width: "100%", marginBottom: 50}}>
        <thead>
          <tr>
            <th style={styles.th}>INVOICE NO</th>
            <th style={styles.th}>ORDER NO</th>
            <th style={styles.th}>ORDER DATE</th>
            <th style={styles.th}>DELIVERY DATE</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{background: "none"}}>
            <td style={styles.td}>{invoice && invoice.invoiceNumber}</td>
            <td style={styles.td}>{formData.number}</td>
            <td style={styles.td}>{formData.orderDate ? util.formatDate(formData.orderDate, "DD/MM/YYYY") : ""}</td>
            <td style={styles.td}>{formData.expectedShipmentDate ? util.formatDate(formData.expectedShipmentDate, "DD/MM/YYYY hh:mm A") : ""}</td>
          </tr>
        </tbody>
      </table>

      <table style={{width: "100%", marginBottom: 40}}>
        <thead>
          <tr>
            <th style={{...styles.th, width: "50%"}}>វិក័យបត្រទៅ/INVOICE TO</th>
            <th style={{...styles.th, width: "50%"}}>ដឹកទៅ/SHIP TO</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{background: "none"}}>
            <td style={styles.td}>
              <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                {
                  formData.company ?
                  <li>
                    Company/Shop Name: <strong>{formData.company}</strong> 
                  </li>
                  :
                  "" 
                }
                <li>
                  Customer Name: <strong>{formData.firstName} {formData.lastName}</strong> 
                </li>
                <li>
                  Address: <strong>{formData.address}</strong>
                </li>
                <li>
                  Contact Number: <strong>{formData.phoneNumber}</strong>
                </li>
              </ul>
            </td>
            <td style={styles.td}>
              <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                <li>Shipping Detail: <strong>{formData.shippingDetail}</strong></li>
                <li>Shipping Address: <strong>{formData.shippingAddress ? formData.shippingAddress : formData.address}</strong></li>
                <li>Contact Number 1: <strong>{formData.shippingContact1 ? formData.shippingContact1 : formData.phoneNumber}</strong></li>
                <li>Contact Number 2: <strong>{formData.shippingContact2}</strong></li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style={{width: "100%"}}>
        <thead>
          <tr>
              <th style={{...styles.th, width: 60}}>NO.</th>
              <th style={{...styles.th, width: "auto"}}>ITEM DESCRIPTION</th>
              <th style={{...styles.th, width: 120}}>QTY</th>
          </tr>
        </thead>
        <tbody>
          {
            formData.transactionEntries.map((transactionEnty, index) => 
              <tr key={index}>
                <td style={styles.td}>{index+1}</td>
                <td style={styles.td}>{transactionEnty.description}</td>
                <td style={styles.td}>{transactionEnty.quantity+" "+ transactionEnty.unitName}(s)</td>
              </tr> 
            )
          }
        </tbody>
      </table>

      <table style={{width: "100%", marginTop: 40}}>
        <thead>
          <tr>
            <th style={{...styles.th, width: "50%"}}>អ្នកដឹក/DELIVERY BY</th>
            <th style={{...styles.th, width: "50%"}}>អ្នកទទួល/RECEIVED BY</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{background: "none"}}>
            <td style={styles.td}>
              <ul style={{listStyle: "none", padding: 0, margin: 0, width: "100%"}}>
                <li style={styles.signatureRow}>
                  <div>SIGNATURE:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} />
                </li>
                <li style={styles.signatureRow}>
                  <div>NAME:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} />
                </li>
                <li style={styles.signatureRow}>
                  <div>DATE:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} /> 
                </li>
              </ul>
            </td>
            <td style={styles.td}>
              <ul style={{listStyle: "none", padding: 0, margin: 0, width: "100%"}}>
                <li style={styles.signatureRow}>
                  <div>SIGNATURE:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} />
                </li>
                <li style={styles.signatureRow}>
                  <div>NAME:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} />
                </li>
                <li style={styles.signatureRow}>
                  <div>DATE:</div><div style={{flexGrow: 1, borderBottom: "1px dotted black", height: 1}} /> 
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <ul style={{listStyle: "none", paddingLeft: 0, marginTop: 40, fontSize: 15, fontWeight: "500"}}>
        <li>{setting.businessName}</li>
        <li><div dangerouslySetInnerHTML={{__html: `${setting.address}`.replace("<p>", "").replace("</p>", "")}} /></li>
        <li>E-mail: {setting.email}</li>
        <li>Telephone: {setting.phoneNumber}</li>
      </ul>
    </div>
  );
});

export default DeliveryNote;

const styles = {
  th: {
    width: "25%",
    border: "1.5px solid black",
    backgroundColor: "#c1bfbf",
    padding: 10
  },
  td: {
    border: "1.5px solid black",
    padding: 10 
  },
  signatureRow: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "flex-end"
  }
};

DeliveryNote.defaultProps = {
  formData: {
    number: "",
    companyName: "",
    saleOrderDate: "",
    subTotal: 0,
    total: 0,
    transactionEntries: []
  },
  setting:{
    businessName: "",
    address: ""
  }
};