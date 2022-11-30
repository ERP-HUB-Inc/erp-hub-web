import React from "react";
import Util from "../../../../../common/util";

const util = new Util();

export default function TaxInvoice(props) {

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
    
  const exchangeRate = formData.exchangeRate;

  if (!formData.totalExcludeTax) {
    formData.totalExcludeTax = getSubTotal(formData);
  }
  let discount = Number(formData.discount);
  const deliveryFee = formData.deliveryFee ? formData.deliveryFee : 0;

  let tax = util.floor(formData.total - formData.totalExcludeTax);
  if (!tax)
    tax = 0;

  let entryRowSpan = 2;
  if (discount) {
    entryRowSpan += 1;
  }

  if (deliveryFee) {
    entryRowSpan += 1;
  }
  
  return (
    <table className="table-invoice" style={props.style}>
      <tbody>
        <tr style={{background: "none"}}>
          <td style={{position: "relative", textAlign: "center", lineHeight: "28px", borderBottom: "2px solid #000", paddingBottom: 0}}>
            <img src={`${util.getGeneralImage(`${formData.clientId}/general/${formData.client ? formData.client.logo : ""}`).url}`} alt="Logo" style={{position: "absolute", top: 0, left: 0, height: 90}} />
            <h2 style={{fontFamily: "Khmer OS Muol Light"}}>{formData.client ? formData.client.businessNamekm : ""}</h2>
            <h3 style={{textTransform: "uppercase", fontFamily: "Time News Romen", fontWeight: "bold"}}>{formData.client ? formData.client.businessName : ""}</h3>
            <h6 style={{fontWeight: 610, marginLeft: 118}}>លេខអត្តសញ្ញាណកម្ម អតប​ (VATTIN) {formData.client ? formData.client.VATNo : ""}</h6>
            <div style={{width: 705, margin: "auto"}} dangerouslySetInnerHTML={{__html: formData.client ? formData.client.address : ""}} />
            <div style={{fontSize: 13, color: "#224b99", marginLeft: 120}}>ទូរស័ព្ទលេខ: {util.formatPhonenoWithCountryCode(formData.client ? formData.client.phoneNumber : "")}, Email:{formData.client ? formData.client.email : ""}</div>
          </td>
        </tr>
        <tr>
          <td style={{textAlign: "center"}}>
            <div style={{color: "#0a4eb7", fontFamily: "Khmer OS Muol Light", fontSize: 19}}>{props.invoiceTaxTitleKH}</div>
            <div style={{fontFamily: "Time New Romen", fontWeight: 600, textTransform: "uppercase"}}>TAX {props.invoiceTitle}</div>
          </td>
        </tr>
        <tr>
          <td style={{padding: 0}}>
            <table className="table-invoice-data">
              <tbody>
                <tr>
                  <td colSpan={3} style={{borderRight: 0, padding: "0 6px"}}>
                    <div style={{height: 34, borderRight: "1px solid", width: 160, lineHeight: "34px"}}>
                      <span style={{fontFamily: "Khmer OS Muol Light"}}>អតិថិជន</span>/Customer:
                    </div>
                  </td>
                  <td rowSpan={2} style={{fontWeight: 600, textAlign: "right"}}>
                    <div>{props.invoiceNoTitleKH} :</div>
                    <div>{props.invoiceNoTitle} :</div>
                  </td>
                  <td style={{fontWeight: 600, textAlign: "center"}} rowSpan={2}>{formData.invoiceNumber}</td>
                </tr>
                <tr>
                  <td colSpan={3}>{formData.company ? formData.company : `${formData.firstName} ${formData.lastName}` }</td>
                </tr>
                <tr>
                  <td colSpan={3}>Address: {formData.address}</td>
                  <td rowSpan={2} style={{fontWeight: 600, textAlign: "right"}}>
                    <div>កាលបរិច្ឆេទ :</div>
                    <div>Date :</div>
                  </td>
                  <td style={{fontWeight: 600, textAlign: "center"}} rowSpan={2}>{util.formatDate(formData.invoiceDate, "D-MM-YYYY")}</td>
                </tr>
                <tr><td colSpan={3}></td></tr>
                <tr>
                  <td colSpan={3}></td>
                  <td rowSpan={2} style={{fontWeight: 600, textAlign: "right"}}>
                    <div>ល/ខការទូទាត់ :</div>
                    <div>Term of Payment :</div>
                  </td>
                  <td style={{fontWeight: 600, textAlign: "center"}} rowSpan={2}>{formData.terms}</td>
                </tr>
                <tr className="customer-info-row"><td colSpan={3}>លេខអត្តសញ្ញាណកម្ម អតប (VATTIN): {formData.VATNo}</td></tr>
                <tr>
                  <td colSpan={3} style={{border: "2px solid"}}></td>
                  <td colSpan={2} style={{border: "2px solid"}}></td>
                </tr>
                <tr style={{textTransform: "capitalize", textAlign: "center"}} className="entry-header">
                  <th style={{width: 54}}><div>ល_រ</div><div>No.</div></th>
                  <th>
                    <div>បរិយាយមុខទំនិញ</div>
                    <div>Description</div>
                  </th>
                  <th>
                    <div>បរិមាណ</div>
                    <div>Quantity</div>
                  </th>
                  <th style={{width: 150}}>
                    <div>ថ្លៃ​ឯកតា</div>
                    <div>Unit Price</div>
                  </th>
                  <th style={{width: 156}}>
                    <div style={{width: 140}}>ថ្លៃសេវា</div>
                    <div>Amount</div>
                  </th>
                </tr>
                {
                  formData.transactionEntries && formData.transactionEntries.map((entry, index) => (
                    <tr key={index} className={`tax-table-invoice-entry-row ${entry.status === 3 ? "hidden" : ""}`}>
                      <td style={{textAlign: "center"}}>{index + 1}</td>
                      <td>
                        <pre className="entry-note-column">{entry.description}</pre>
                        {entry.enableDescription ? renderSerials(entry) : null}
                      </td>
                      <td style={{textAlign: "center"}}>{entry.quantity}</td>
                      <td style={{textAlign: "right"}}>{util.formatCurrency(entry.price)}</td>
                      <td style={{textAlign: "right"}}>{util.formatCurrency(entry.quantity * util.floor(entry.price))}</td>
                    </tr>
                  ))
                }
                <tr>
                  <td colSpan={2} rowSpan={entryRowSpan}></td>
                  <td colSpan={2} style={{textAlign: "right"}}><div>សរុប</div><div>Sub Total</div></td>
                  <td style={{textAlign: "right"}}>{util.formatCurrency(formData.totalExcludeTax)}</td>
                </tr>
                {
                  formData.discount ?
                  <tr>
                    <td colSpan={2} style={{textAlign: "right"}}><div>បញ្ចុះតម្លៃ</div><div>Discount</div></td>
                    <td style={{textAlign: "right"}}>{util.formatCurrency(discount)}</td>
                  </tr>
                  : null
                }
                <tr style={{textAlign: "right"}}>
                  <td colSpan={2}>
                    <div>អាករលើតម្លៃបន្ថែម{util.fromStandardNumberKHV2(util.getTaxRate(formData.totalExcludeTax - discount, tax))}%</div>
                    <div>VAT({util.getTaxRate(formData.totalExcludeTax - discount, tax)}%)</div>
                  </td>
                  <td>{util.formatCurrency(tax)}</td>
                </tr>
                {deliveryFee ? <tr style={{textAlign: "right"}}>
                  <td colSpan={2}>
                    <div>តម្លៃដឹកជញ្ជូន</div>
                    <div>Delivery Fee</div>
                  </td>
                  <td>{util.formatCurrency(deliveryFee)}</td>
                </tr>
                : null}
                <tr style={{fontWeight: 600}}>
                  <td colSpan={2} style={{textTransform: "capitalize"}}>{util.converNumberToWord(formData.total - discount + deliveryFee )}</td>
                  <td colSpan={2} style={{textAlign: "right"}}><div>សរុបរួម</div><div>Grand Total</div></td>
                  <td style={{textAlign: "right"}}>{util.formatCurrency(formData.total - discount + deliveryFee)}</td>
                </tr>
                {
                  exchangeRate ?
                  <tr style={{fontWeight: 600}}>
                    <td colSpan={2} style={{borderRight: "none"}}>
                      <div style={{display: "flex", justifyContent: "space-between"}}><div>អត្រាប្ដូរប្រាក់</div><div>{exchangeRate}</div></div>
                    </td>
                    <td style={{textAlign: "right"}} colSpan={2}>សរុបជាប្រាក់រៀល</td>
                    <td style={{textAlign: "right"}}>{util.formatCurrency((formData.total - discount +  deliveryFee) * exchangeRate, "")} ៛</td>
                  </tr>
                  : null
                }
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <div 
              dangerouslySetInnerHTML={{ __html: formData.publicNote}} 
              id="public-not"
            />
          </td>
        </tr>
        <tr>
          <td style={{display: "flex", justifyContent: "space-between", textAlign: "center", paddingTop: 60}}>
            <div>
              <hr />
              <div>ហត្ថលេខា និងឈ្មេាះអ្នកទិញ</div>
              <div>Customer's Signature & Name</div>
            </div>
            <div>
              <hr />
              <div>ហត្ថលេខា និងឈ្មេាះអ្នកលក់</div>
              <div>Seller's Signature & Name</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

TaxInvoice.defaultProps = {
  invoiceTitle: "Invoice",
  invoiceTaxTitleKH: "វិក្កយបត្រអាករ",
  invoiceNoTitle: "Invoice No",
  invoiceNoTitleKH: "លេខវិក្កយបត្រ",
  invoiceDateTitle: "Invoice Date",
  dueDateTitle: "Due Date"
};