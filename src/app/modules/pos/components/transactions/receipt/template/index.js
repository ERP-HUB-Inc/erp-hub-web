import React from "react";
import Util from "../../../../../common/util";

const ReceiptTemplate = React.forwardRef((props, ref) => {
  const util = new Util();

  const setting = util.getSetting();
  const {formData} = props;
  const total = formData.transactionPayment && formData.transactionPayment[0] && formData.transactionPayment[0].tender;

  return (
    <div ref={ref} style={{width: "250mm", minHeight: "297mm", padding: "45px 40px", margin: "auto", background: "#FFFFFF"}}>
      <table style={{width: "100%"}}>
        <tbody>
          <tr style={{background: "none"}}>
            <td style={{textAlign: "center", position: "relative"}}>
              <img src={`${util.getProductImage(setting.logo, "general").url}`} alt="Logo" style={{position: "absolute", top: 0, left: 0, height: 60}} />
              <h2 style={{fontFamily: "Khmer OS Muol Light"}}>{setting.businessNamekm}</h2>
              <h3 style={{textTransform: "uppercase", fontFamily: "Time News Romen", fontWeight: "bold"}}>{setting.businessName}</h3>
              <div style={{width: 800, margin: "auto"}} dangerouslySetInnerHTML={{__html: setting.address}} />
            </td>
          </tr>
          <tr>
            <td style={{border: "2px solid", padding: 15}}>
              <h2 style={{color: "#c56f6f", fontWeight: "bold", textAlign: "center"}}>Official Receipt</h2>
              <ul style={{listStyle: "none", paddingRight: 45}}>
                <li style={styles.listItemStyle}><div style={{width: 100}}>NO.:</div>{formData.receiptNumber}</li>
                <li style={styles.listItemStyle}><div style={{width: 100}}>Date:</div>{util.formatDate(formData.createdAt, "D-MMM-YY")}</li>
              </ul>

              <div style={styles.itemFlex}>
                <div>Received From:</div>
                <div style={{borderBottom: "2px solid", flexGrow: 1, marginLeft: 28}}>{formData.customer ? formData.customer.company : `${formData.firstName} ${formData.lastName}`}</div>
              </div>
              <div style={styles.itemFlex}>
                <div>Amount:</div>
                <div style={{width: 190, borderBottom: "2px solid", wordSpacing: 20, marginLeft: 28, height: "fit-content"}}>
                  USD {util.formatCurrency(total)}
                </div>
                <div style={{width: 170, paddingLeft: 14}}>
                  <label style={styles.checkBoxStyle}>
                    <input type="checkbox" />
                    <span>By Cash</span>
                  </label>
                  <label style={styles.checkBoxStyle}>
                    <input type="checkbox" />
                    <span>Bank</span>
                  </label>
                </div>
                <div>
                  <label style={styles.checkBoxStyle}>
                    <input type="checkbox" />
                    <span>By Cheque No.:</span>
                  </label>
                </div>
                <div style={{flexGrow: 1, borderBottom: "2px solid", marginLeft: 28, height: 32}}>{formData.chequeNo}</div>
              </div>
              <div style={styles.itemFlex}>
                <div style={{width: 136}}>Amount in Words:</div>
                <div style={{borderBottom: "2px solid", flexGrow: 1, marginLeft: 28}}>{util.converNumberToWord(total)}</div>
              </div>
              <div style={styles.itemFlex}>
                <div>Being Payment Inv.No:</div>
                <div style={{borderBottom: "2px solid", flexGrow: 1, marginLeft: 28}}>{formData.invoiceNumber}</div>
              </div>

              <div style={{display: "flex", alignItems: "flex-end", flexDirection: "column", textAlign: "center", marginTop: 100}}>
                <div>
                  <div style={{borderTop: "2px solid", width: 252, paddingTop: 4}}>Signature & Received by</div>
                  <div style={{color: "black"}}>{setting.businessName}</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default ReceiptTemplate;

ReceiptTemplate.defaultProps = {
  formData: {
    invoiceNumber: "",
    receiptNumber: "",
    createdAt: "2022-07-08",
    total: 0,
    customer: {
      company: ""
    }
  }
};

const styles = {
  itemFlex: {
    display: "flex",
    lineHeight: "30px",
    marginTop: 10
  },
  listItemStyle: {
    display: "flex",
    justifyContent: "flex-end"
  },
  checkBoxStyle: {
    display: "grid",
    gridTemplateColumns: "2em auto",
    gap: "16px",
    margin: 0
  }
};