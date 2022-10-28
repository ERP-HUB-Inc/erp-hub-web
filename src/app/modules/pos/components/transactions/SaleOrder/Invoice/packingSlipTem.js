import React from "react";
import Util from "../../../../../common/util";

export const PackingSlipTem = React.forwardRef((props, ref) => {

  const util = new Util();
  const setting = util.getSetting();

  const {formData} = props.formData ? props : PackingSlipTem.defaultProps;

  return (
      <div style={{display: "none"}}>
        <div ref={ref} style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
          <table style={{width: "100%"}}>
            <tbody>
            <tr style={{background: "none"}}>
              <td>
                <div>{setting.businessName}</div>
                <div style={{paddingRight: "20%"}} dangerouslySetInnerHTML={{__html: setting.address}} />
              </td>
              <td style={{textAlign: "right"}}>
                <h2>Packing Slip</h2>
                <div style={{fontWeight: 600}}>Invoice No. {formData.number}</div>
                <div>
                  <div> Date: {util.formatDate(formData.registerDate, "DD MMM YYYY")}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{paddingTop: "15px"}}>
                <div style={{fontWeight: "bold"}}>Customer</div>
                <span>{formData.firstName+ " "+ formData.lastName}</span>
                <div style={{paddingRight: "20%"}}>{formData.address}</div>
                <div style={{paddingRight: "20%"}}>
                  <span style={{fontWeight: "bold"}}>Mobile: </span>{util.formatPhoneno(formData.phoneNumber)}
                </div>
              </td>
              <td style={{verticalAlign: "baseline",paddingTop: "15px", textAlign: "right"}}>
                <div style={{paddingLeft: "20%"}}><span style={{fontWeight: "bold"}}>Shipping Address:</span> {formData.address}</div>
              </td>
            </tr>
            <tr style={{background: "none"}}>
              <td colSpan={2} style={{paddingTop: 16}}>
                <table style={{width: "100%"}}>
                  <thead>
                  <tr style={{background: "#287ec5", color: "white", height: 34}}>
                    <td style={{width: 40,border: "1px solid lightgray", textAlign: "center"}}>#</td>
                    <td style={{border: "1px solid lightgray", textAlign: "center"}}>Product</td>
                    <td style={{border: "1px solid lightgray", textAlign: "center"}}>Quantity</td>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    formData.transactionEntries.map((entry, index) =>
                        <tr  key={index} style={{ background: "none", verticalAlign: "top"}}>
                          <td style={{padding: 15,border: "1px solid lightgray", textAlign: "center"}}>{index + 1}</td>
                          <td style={{padding: 15, border: "1px solid lightgray"}}>
                          <pre style={{fontSize: "11pt", fontFamily: "enfont,khfont", whiteSpace: "pre-wrap", border: "none", marginBottom: 0}}>
                            {entry.description}
                          </pre>
                          </td>
                          <td style={{padding: 15,border: "1px solid lightgray", textAlign: "right"}}>{entry.quantity+" "+ entry.unitName}(s)</td>
                        </tr>
                    )
                  }
                  </tbody>
                </table>
              </td>
            </tr>
            </tbody>
          </table>
          <p style={{fontWeight: "bold", marginTop: 20}}>Authorized Signatory</p>
        </div>
      </div>
  );
});

PackingSlipTem.defaultProps = {
  formData: {
    number: "SO-00008",
    companyName: "CA",
    saleOrderDate: "2022-08-24",
    subTotal: 0,
    total: 0,
    transactionEntries: []
  },
  setting:{
    businessName: "",
    address: ""
  }
};