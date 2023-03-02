import React from "react";
import Util from "../../../../../common/util";
import "./style.css";

const util = new Util();
const dateFormat = "DD-MM-YYYY";

export default function NoneTaxInvoice(props) {
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
        <tr style={{background: "none", verticalAlign: "top"}}>
          <td style={{height: 100, paddingLeft: 0}}>
            <img src={util.getGeneralImage(`${client.clientId}/general/${client.logo}`).url} alt="Logo" style={{height: "100%"}} />
          </td>
          <td style={{width: 230}}>
            <ul style={styles.ulStyle}>
              <li style={{color: "#37a3c6", fontSize: "12pt", textTransform: "uppercase"}}>{formData.client && formData.client.businessName}</li>
              <li><a target="blank" style={{textDecoration: "none", color: "#212529"}} href={formData.client && formData.client.website}>{formData.client && formData.client.website}</a></li>
              <li>{formData.client && formData.client.email}</li>
              <li>{util.formatPhonenoWithCountryCode(formData.client && formData.client.phoneNumber)}</li>
            </ul>
          </td>
          <td style={{paddingRight: 0, lineHeight: "28px"}}>
            <div dangerouslySetInnerHTML={{__html: formData.client && formData.client.address}} />
          </td>
        </tr>
        <tr>
          <td colSpan={3} >
            <div style={{color: "#37a3c6", paddingBottom: 10, textTransform: "uppercase"}}>{props.invoiceTitle}</div>
          </td>
        </tr>
        <tr style={{background: "none", borderTop: "2px solid #ddd", borderBottom: "2px solid #ddd"}}>
          <td style={{paddingTop: 6, paddingBottom: 6, width: 280}}>
            <ul style={styles.ulStyle}>
              <li style={{display: "flex"}}>
                <div style={{width: 150}}>{props.numberTitle}</div><div style={{fontWeight: 600}}>{formData.invoiceNumber}</div>
              </li>
              <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 150}}>{props.invoiceDateTitle}</div><div>{formData.invoiceDate ? util.formatDate(formData.invoiceDate, dateFormat) : null}</div>
              </li>
              <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 150}}>{props.dueDateTitle}</div><div>{formData.dueDate ? util.formatDate(formData.dueDate, dateFormat) : null}</div>
              </li>
              <li style={{display: "flex"}} className="inv-header-title">
                <div style={{width: 150}}>Balance Due</div><div style={{fontWeight: 600}}>{util.formatCurrency(formData.total - discount)}</div>
              </li>
            </ul>
          </td>
          <td colSpan={2} style={{paddingTop: 6, paddingBottom: 6, position: "relative"}}>
            <ul style={{...styles.ulStyle, position: "absolute", top: 6}}>
              <li>{formData.firstName} {formData.lastName}</li>
              <li className="inv-header-title">{formData.phoneNumber}</li>
              <li style={{fontWeight: 600}} className="inv-header-title">{formData.company}</li>
              {/* <li>{formData.address}</li> */}
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
          <td style={{width: 240}} className="inv-summary">
            <div style={{display: "flex", justifyContent: "space-between", textAlign: "right", paddingLeft: 80, lineHeight: "28px"}}>
               <div>
                  <div>Subtotal</div>
                  {discount && discount > 0 ? <div style={{marginTop: 3}}>Discount</div> : null}
                  {tax ? <div style={{marginTop: 3}}>VAT</div> : null}
                  {deliveryFee ? <div style={{marginTop: 3}}>Delivery Fee</div> : null}
                  <div style={{marginTop: 3}}>Grand Total</div>
               </div>
              <div>
                  <div>{util.formatCurrency(subtotal)}</div>
                  {discount && discount > 0 ? <div style={{marginTop: 3}}>{util.formatCurrency(discount)}</div> : null}
                  {tax ? <div style={{marginTop: 3}}>{util.formatCurrency(tax)}</div> : null}
                  {deliveryFee ? <div style={{marginTop: 3}}>{util.formatCurrency(deliveryFee)}</div> : null}
                  <div style={{fontWeight: 600, marginTop: 3}}>{util.formatCurrency(formData.total - discount + deliveryFee)}</div>
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

NoneTaxInvoice.defaultProps = {
  invoiceTitle: "Invoice",
  numberTitle: "Invoice Number",
  invoiceDateTitle: "Invoice Date",
  dueDateTitle: "Due Date"
};

const styles = {
  ulStyle: {
    listStyleType: "none",
    padding: 0,
    fontSize: "11pt",
    marginBottom: 0,
    lineHeight: "25px"
  },
  entriesCurrency: {
    textAlign: "right",
  }
};