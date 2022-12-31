import React from "react";
import Util from "../../../../../common/util";

const PackingSlip = React.forwardRef((props, ref) => {

  const util = new Util();
  const setting = util.getSetting();

  const {formData} = props.formData ? props : PackingSlip.defaultProps;
  
  return (
      <div style={{display: "none", background: "white"}}>
        <div ref={ref} style={{width: "250mm", margin: "auto", minHeight: "297mm"}}>
          <table style={{width: "100%", marginBottom: 50}}>
            <tbody>
              <tr style={{background: "none"}}>
                <td style={{textAlign: "left"}}>
                  <img src={util.getGeneralImage(`${formData.clientId}/general/${formData.client ? formData.client.logo : ""}`).url} alt="Logo" style={{height: 140}} />
                </td>
                <td style={{textAlign: "right", verticalAlign: "top"}}>
                  <h1 style={{textTransform: "uppercase", fontWeight: "bold"}}>Packing Slip</h1>
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{width: "100%", marginBottom: 40}}>
            <thead>
              <tr>
                <th style={{...styles.th, width: "50%"}}>អ្នកផ្ញើរ/SENDER</th>
                <th style={{...styles.th, width: "50%"}}>អ្នកទទួល/RECEIVER</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "none"}}>
                <td style={styles.td}>
                  <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                    {
                      formData.company ?
                      <li>
                        Company/Shop Name: <strong>{setting.businessName}</strong> 
                      </li>
                      :
                      "" 
                    }
                    <li>
                      Address: <strong>{setting.address}</strong>
                    </li>
                    <li>
                      Contact Number: <strong>{setting.phoneNumber}</strong>
                    </li>
                  </ul>
                </td>
                <td style={styles.td}>
                  <ul style={{listStyle: "none", paddingLeft: 0, margin: 0}}>
                    <li>Address: {formData.shippingAddress ? formData.shippingAddress : formData.address}</li>
                    <li>Contact Number 1: <strong>{formData.shippingContact1 ? formData.shippingContact1 : formData.phoneNumber}</strong></li>
                    <li>Contact Number 2: {formData.shippingContact2}</li>
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
          
          <div style={{width: "100%", height: 140, marginTop: 40, border: "1.5px solid black", padding: 15}}>
            <div>Notes</div>
          </div>
        </div>
      </div>
  );
});

export default PackingSlip;

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

PackingSlip.defaultProps = {
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