import React from "react";
import Enum from "../../../../enums";
import Util from "../../../../../common/util";
import "./style.css";

const util = new Util();
const dateFormat = "DD-MM-YYYY";

export default function NoneTaxInvoice(props) {

  function getSubTotal(formData) {
    let subtotal = 0;
    if (formData.transactionEntries.length) {
      formData.transactionEntries.forEach(entry => {
        if (entry.status !== 3)
          subtotal += entry.quantity * entry.price;
      });
    }
    if (!subtotal) 
      subtotal = 0;
  
    return subtotal;
  }

  function getDiscount(formData) {
    let discount = formData.discount;
    if (formData.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
      discount = util.getValueFromPercentage(formData.subtotal, discount);
    }

    if (!discount) 
      discount = 0;

    return discount;
  }

  const {formData, setting} = props;
  let discount = getDiscount(formData);
  let subtotal = getSubTotal(formData);

  if (!formData.totalExcludeTax) {
    formData.totalExcludeTax = subtotal;
  }

  let tax = formData.total - formData.totalExcludeTax;
  if (!tax || tax < 0)
    tax = 0;

  return (
    <table className="table-invoice">
      <tbody>
        <tr style={{background: "none", verticalAlign: "top"}}>
          <td style={{height: 100, paddingLeft: 0}}>
            <img src={util.getProductImage(setting.logo, "general").url} alt="Logo" style={{height: "100%"}} />
          </td>
          <td style={{width: 230}}>
            <ul style={styles.ulStyle}>
              <li style={{color: "#37a3c6", fontSize: "12pt", textTransform: "uppercase"}}>{setting.businessName}</li>
              <li><a target="blank" style={{textDecoration: "none", color: "#212529"}} href={setting.website}>{setting.website}</a></li>
              <li>{setting.email}</li>
              <li>{util.formatPhonenoWithCountryCode(setting.phoneNumber)}</li>
            </ul>
          </td>
          <td style={{paddingRight: 0, lineHeight: "28px"}}>
            <div dangerouslySetInnerHTML={{__html: setting.address}} />
          </td>
        </tr>
        <tr>
          <td colSpan={3} >
            <div style={{color: "#37a3c6", paddingBottom: 10}}>INVOICE</div>
          </td>
        </tr>
        <tr style={{background: "none", borderTop: "2px solid #ddd", borderBottom: "2px solid #ddd"}}>
          <td style={{paddingTop: 6, paddingBottom: 6, width: 244}}>
            <ul style={styles.ulStyle}>
              <li style={{display: "flex"}}>
                <div style={{width: 145}}>Invoice Number</div><div style={{fontWeight: 600}}>{formData.invoiceNumber}</div>
              </li>
              <li style={{display: "flex"}}>
                <div style={{width: 145}}>Invoice Date</div><div>{util.formatDate(formData.invoiceDate, dateFormat)}</div>
              </li>
              <li style={{display: "flex"}}>
                <div style={{width: 145}}>Due Date</div><div>{formData.dueDate ? util.formatDate(formData.dueDate, dateFormat) : null}</div>
              </li>
              <li style={{display: "flex"}}>
                <div style={{width: 145}}>Balance Due</div><div>{util.formatCurrency(formData.total - discount)}</div>
              </li>
            </ul>
          </td>
          <td colSpan={2} style={{paddingTop: 6, paddingBottom: 6, position: "relative"}}>
            <ul style={{...styles.ulStyle, position: "absolute", top: 6}}>
              <li style={{fontWeight: 600}}>
                {
                  formData.company ? formData.company : `${formData.firstName} ${formData.lastName}`
                }
              </li>
              <li>{formData.address}</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td colSpan={3} style={{padding: 0}}>
            <table className="table-invoice-entry">
              <thead>
                <tr style={{height: 54, background: "none", borderBottom: "2px solid #ddd"}}>
                  <th style={{width: 20}}>Item</th>
                  <th style={{width: 380}}>Description</th>
                  <th style={{textAlign: "right"}}>Price</th>
                  <th style={{textAlign: "right"}}>Quantity</th>
                  <th style={{textAlign: "right"}}>Amount</th>
                </tr>
              </thead>
              <tbody style={{background: "#fbfbfb", borderBottom: "2px solid #ddd", verticalAlign: "top"}}>
                {
                  formData.transactionEntries.map((entry, index) => 
                    <tr key={index} style={{fontSize: "11pt", lineHeight: "26px", background: "none", display: `${entry.status === 3 ? "none" : ""}`}}>
                      <td style={{textAlign: "center"}}>{index + 1}</td>
                      <td ><pre className="entry-note-column">{entry.description}</pre></td>
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
        <tr style={{background: "none"}}>
          <td colSpan={2}></td>
          <td style={{width: 300}}>
            <div style={{display: "flex", justifyContent: "space-between", textAlign: "right", paddingLeft: 80, paddingTop: 20, lineHeight: "28px"}}>
              <div>
                <div>Subtotal</div>
                {
                  discount && discount > 0 ?
                    <div>Discount</div>
                  : null
                }
                {
                  tax ?
                    <div>VAT</div>
                  : null
                }
                <div>Paid to Date</div>
                <div>Balance</div>
              </div>
              <div>
                <div>{util.formatCurrency(subtotal)}</div>
                {
                  discount && discount > 0 ?
                    <div>{util.formatCurrency(discount)}</div>
                  : null
                }
                {
                  tax ?
                    <div>{util.formatCurrency(tax)}</div>
                  : null
                }
                <div>{util.formatCurrency(0)}</div>
                <div style={{color: "#37a3c6"}}>{util.formatCurrency(formData.total - discount)}</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

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