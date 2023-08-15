import React from "react";
import Util from "../../../../../common/util";
import "./style.css";

const util = new Util();
const dateFormat = "DD-MM-YYYY hh:mm A";

export default function NonOfficialInvoice(props) {
  function renderSerials(entry) {
    let serialStr = null;
    let serialNo = entry.serialNo && entry.serialNo.toString().split(",");
    if (serialNo && serialNo.length) {
      let serialLen = serialNo.length;
      serialStr = <div style={{fontSize: 13, display: "flex", flexWrap: "wrap"}}>
        <label style={{color: "#033261", marginRight: 6, marginBottom: 0}}>IMEI or Serial Number:</label>
        {
          serialStr = serialNo.map((serial, index) =>
            <span key={index} style={{marginRight: 5}}>{serial}{index < serialLen - 1 ? "," : ""}</span>
          )
        }
      </div>;
    }
    return serialStr;
  }

  function getSubTotal(formData) {
    let subtotal = 0;
    if (formData.transactionEntries && formData.transactionEntries.length) {
      formData.transactionEntries.forEach(entry => {
        if (entry.status !== 3)
          subtotal += entry.quantity * entry.price;
      });
    }
    if (!subtotal) 
      subtotal = 0;
  
    return subtotal;
  }

  const {formData} = props;
  let discount = Number(formData.discount);
  let subtotal = getSubTotal(formData);

  if (!formData.totalExcludeTax) {
    formData.totalExcludeTax = subtotal;
  }

  let tax = formData.total - formData.totalExcludeTax;
  if (!tax || tax < 0)
    tax = 0;

  const deliveryFee = formData.deliveryFee ? formData.deliveryFee : 0;

  let client = {
    clientId: null,
    logo: null
  };

  if (formData.client) {
    client.clientId = formData.clientId;
    client.logo = formData.client.logo;
  } else {
    client.clientId = util.getClientId();
    client.logo = util.getClientLogo();
  }

  return (
    <table className="table-invoice">
      <tbody>
        <tr>
          <td colSpan={2}><div style={{fontSize: 18}}>អតិថិជន</div></td>
        </tr>
        <tr style={{background: "none", borderTop: "2px solid #ddd", borderBottom: "2px solid #ddd", height: 94}}>
          <td style={{paddingTop: 6, paddingBottom: 6, width: 280}}>
            <ul style={styles.ulStyle}>
              {/* <li style={{display: "flex"}}>
                <div style={{width: 150}}>{props.numberTitle}</div><div style={{fontWeight: 600}}>{formData.invoiceNumber}</div>
              </li> */}

              <li>{formData.firstName} {formData.lastName}</li>
              <li className="inv-header-title">{formData.phoneNumber}</li>
              <li style={{fontWeight: 600}} className="inv-header-title">{formData.company}</li>
             
            </ul>
          </td>
          <td colSpan={2} style={{paddingTop: 6, paddingBottom: 6, position: "relative"}}>
            <ul style={{...styles.ulStyle, position: "absolute", top: 6}}>

            <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 140}}>{props.invoiceDateTitle}</div><div>{formData.invoiceDate ? util.formatDate(formData.invoiceDate, dateFormat) : null}</div>
              </li>
              <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 140}}>{props.dueDateTitle}</div><div>{formData.dueDate ? util.formatDate(formData.dueDate, dateFormat) : null}</div>
              </li>
              <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 140}}>Balance Due</div><div style={{fontWeight: 600}}>{util.formatCurrency(formData.total - discount)}</div>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td colSpan={3} style={{padding: 0}}>
            <table className="table-invoice-entry">
              <thead>
                <tr style={{height: 54, background: "none", borderBottom: "2px solid #ddd"}}>
                  <th style={{width: 70, textAlign: "center"}}>Item</th>
                  <th style={{width: 350}}>Description</th>
                  <th style={{textAlign: "right"}}>Price</th>
                  <th style={{textAlign: "right"}}>Quantity</th>
                  <th style={{textAlign: "right"}}>Amount</th>
                </tr>
              </thead>
              <tbody style={{background: "#fbfbfb", borderBottom: "2px solid #ddd", verticalAlign: "top"}}>
                {
                  formData.transactionEntries && formData.transactionEntries.filter(entry => entry.description).map((entry, index) => 
                    <tr key={index} style={{fontSize: "11pt", lineHeight: "26px", background: "none", display: `${entry.status === 3 ? "none" : ""}`}}>
                      <td style={{textAlign: "center"}}>{index + 1}</td>
                      <td >
                        <pre className="entry-note-column">{entry.description}</pre>
                        {entry.enableDescription ? renderSerials(entry) : null}
                        {entry.specification && <div className="line-item-specification" dangerouslySetInnerHTML={{__html: entry.specification}}/>}
                      </td>
                      <td style={styles.entriesCurrency}>{util.formatCurrency(entry.price)}</td>
                      <td style={styles.entriesCurrency}>{entry.quantity}</td>
                      <td style={styles.entriesCurrency}>{util.formatCurrency(util.floor(entry.price) * entry.quantity)}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </td>
        </tr>
        <tr style={{background: "none", verticalAlign: "initial"}}>
          <td colSpan={2}>
            <div 
              dangerouslySetInnerHTML={{ __html: formData.publicNote}} 
              id="public-not" />
          </td>
          <td style={{width: 280}} className="inv-summary">
            <div style={{display: "flex", justifyContent: "space-between", textAlign: "right", paddingLeft: 80, lineHeight: "28px"}}>
               <div style={{marginRight: 15}}>
                  <div>Subtotal</div>
                  {discount && discount > 0 ? <div style={{marginTop: 3}}>Discount</div> : null}
                  {tax ? <div style={{marginTop: 3}}>VAT</div> : null}
                  {deliveryFee ? <div style={{marginTop: 3}}>Delivery Fee</div> : null}
                  <div style={{marginTop: 3}}>Grand Total</div>
                  {formData.deposit > 0 && <div style={{marginTop: 3}}>Deposit</div>}
               </div>
              <div>
                  <div>{util.formatCurrency(subtotal)}</div>
                  {discount && discount > 0 ? <div style={{marginTop: 3}}>{util.formatCurrency(discount)}</div> : null}
                  {tax ? <div style={{marginTop: 3}}>{util.formatCurrency(tax)}</div> : null}
                  {deliveryFee ? <div style={{marginTop: 3}}>{util.formatCurrency(deliveryFee)}</div> : null}
                  <div style={{fontWeight: 600, marginTop: 3}}>{util.formatCurrency(formData.total - discount + deliveryFee)}</div>
                  {formData.deposit > 0 && <div style={{fontWeight: 600, marginTop: 3}}>{util.formatCurrency(formData.deposit)}</div>}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <div style={{display: "flex", justifyContent: "space-between", textAlign: "center", paddingTop: 60}}>
              <div>
                <hr />
                <div>ហត្ថលេខា និងឈ្មេាះអ្នកទិញ</div>
                <div style={{marginTop: 5}}>Customer's Signature & Name</div>
              </div>
              <div>
                <hr />
                <div>ហត្ថលេខា និងឈ្មេាះអ្នកលក់</div>
                <div style={{marginTop: 5}}>Seller's Signature & Name</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

NonOfficialInvoice.defaultProps = {
  invoiceTitle: "Invoice",
  numberTitle: "Invoice Number",
  invoiceDateTitle: "Date",
  dueDateTitle: "Due Date"
};

const styles = {
  ulStyle: {
    listStyleType: "none",
    padding: 0,
    fontSize: "11pt",
    // marginBottom: 0,
    lineHeight: "25px"
  },
  entriesCurrency: {
    textAlign: "right",
  }
};