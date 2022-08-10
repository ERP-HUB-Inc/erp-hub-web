import React from "react";
import Enum from "../../../../enums";
import Util from "../../../../../common/util";

export default function TaxInvoice(props) {
  const util = new Util();

  function getSubTotal(formData) {
    let subtotal = 0;
    if (formData.transactionEntries.length) {
      formData.transactionEntries.forEach(entry => {
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
    return discount;
  }

  const {formData, setting} = props;
    
  formData.subtotal = getSubTotal(formData);
  const exchangeRate = formData.exchangeRate;

  if (!formData.totalExcludeTax) {
    formData.totalExcludeTax = formData.subtotal;
  }
  
  let tax = formData.total - formData.totalExcludeTax;
  if (!tax)
    tax = 0;
  return (
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      <table className="table-invoice">
        <tbody>
          <tr style={{background: "none"}}>
            <td style={{position: "relative", textAlign: "center", lineHeight: "28px", borderBottom: "2px solid #000", paddingBottom: 0}}>
              <img src={`${util.getProductImage(setting.logo, "general").url}`} alt="Logo" style={{position: "absolute", top: 0, left: 0, height: 90}} />
              <h2 style={{fontFamily: "Khmer OS Muol Light"}}>{setting.businessNamekm}</h2>
              <h3 style={{textTransform: "uppercase", fontFamily: "Time News Romen", fontWeight: "bold"}}>{setting.businessName}</h3>
              <h6 style={{fontWeight: 610, marginLeft: 118}}>លេខអត្តសញ្ញាណកម្ម អតប​ (VATTIN) {setting.VATNo}</h6>
              <div style={{width: 800, margin: "auto"}} dangerouslySetInnerHTML={{__html: setting.address}} />
              <div style={{fontSize: 13, color: "#224b99", marginLeft: 120}}>ទូរស័ព្ទលេខ: {util.formatPhonenoWithCountryCode(setting.phoneNumber)}, Email:{setting.email}</div>
            </td>
          </tr>
          <tr>
            <td style={{textAlign: "center"}}>
              <div style={{color: "#0a4eb7", fontFamily: "Khmer OS Muol Light", fontSize: 19}}>វិក្កយបត្រអាករ</div>
              <div style={{fontFamily: "Time New Romen", fontWeight: 600}}>TAX INVOICE</div>
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
                      <div>លេខវិក្កយបត្រ :</div>
                      <div>Invoice No :</div>
                    </td>
                    <td style={{fontWeight: 600, textAlign: "center"}} rowSpan={2}>{formData.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>{formData.customer && formData.customer.company ? formData.customer.company : `${formData.firstName} ${formData.lastName}` }</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Address: {formData.customer && formData.customer.address}</td>
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
                  <tr className="customer-info-row"><td colSpan={3}>លេខអត្តសញ្ញាណកម្ម អតប (VATTIN): {formData.customer && formData.customer.VATNo}</td></tr>
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
                    <th>
                      <div style={{width: 140}}>ថ្លៃសេវា</div>
                      <div>Amount</div>
                    </th>
                  </tr>
                  {
                    formData.transactionEntries && formData.transactionEntries.map((entry, index) => (
                      <tr key={index} className="tax-table-invoice-entry-row">
                        <td style={{textAlign: "center"}}>{index + 1})</td>
                        <td><pre className="enty-note-column">{entry.description}</pre></td>
                        <td style={{textAlign: "center"}}>{entry.quantity}</td>
                        <td style={{textAlign: "right"}}>{util.formatCurrency(entry.price)}</td>
                        <td style={{textAlign: "right"}}>{util.formatCurrency(entry.quantity * util.floor(entry.price))}</td>
                      </tr>
                    ))
                  }
                  <tr>
                    <td colSpan={2} rowSpan={formData.discount ? 3 : 2}></td>
                    <td colSpan={2} style={{textAlign: "right"}}><div>សរុប</div><div>Sub Total</div></td>
                    <td style={{textAlign: "right"}}>{util.formatCurrency(formData.subtotal)}</td>
                  </tr>
                  {
                    formData.discount ?
                    <tr>
                      <td colSpan={2} style={{textAlign: "right"}}><div>បញ្ចុះតម្លៃ</div><div>Discount</div></td>
                      <td style={{textAlign: "right"}}>-{util.formatCurrency(getDiscount(formData))}</td>
                    </tr>
                    : null
                  }
                  <tr style={{textAlign: "right"}}>
                    <td colSpan={2}>
                      <div>អាករលើតម្លៃបន្ថែម{util.fromStandardNumberKHV2(util.floor(util.getTaxRate(formData.subtotal - formData.discount, tax)))}%</div>
                      <div>VAT({util.floor(util.getTaxRate(formData.subtotal - formData.discount, tax))}%)</div>
                    </td>
                    <td>{util.formatCurrency(tax)}</td>
                  </tr>
                  <tr style={{fontWeight: 600}}>
                    <td colSpan={2} style={{textTransform: "capitalize"}}>{util.converNumberToWord(formData.total - util.floor(getDiscount(formData)))}</td>
                    <td colSpan={2} style={{textAlign: "right"}}><div>សរុបរួម</div><div>Grand Total</div></td>
                    <td style={{textAlign: "right"}}>{util.formatCurrency(formData.total - util.floor(getDiscount(formData)))}</td>
                  </tr>
                  <tr style={{fontWeight: 600}}>
                    <td colSpan={2} style={{borderRight: "none"}}>
                      <div style={{display: "flex", justifyContent: "space-between"}}><div>អត្រាប្ដូរប្រាក់</div><div>{exchangeRate}</div></div>
                    </td>
                    <td style={{textAlign: "right"}} colSpan={2}>សរុបជាប្រាក់រៀល</td>
                    <td style={{textAlign: "right"}}>{util.formatCurrency((formData.total - util.floor(getDiscount(formData))) * exchangeRate, "")} ៛</td>
                  </tr>
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
    </div>
  );
}