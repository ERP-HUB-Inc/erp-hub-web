import React from "react";
import Util from "../../../../../common/util";

export default function Template(props) {
  const util = new Util();

  const {formData, setting} = props;
  let discount = Number(formData.discount);
  if (!formData.totalExcludeTax) 
    formData.totalExcludeTax = formData.total;

  let tax = formData.total - formData.totalExcludeTax;
  return (
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      <table style={{width: "100%"}}>
        <tbody>
          <tr style={{background: "none"}}>
            <td>
              <h4>{setting.businessName}</h4>
              <div>Cambodia</div>
            </td>
            <td style={{textAlign: "right"}}>
              <h2>SALES ORDER</h2>
              <div style={{fontWeight: 600}}>Sales Order# {formData.number}</div>
            </td>
          </tr>
          <tr>
            <td style={{paddingTop: 40}}>
              Bill To <div>{formData.company ? formData.company : `${formData.firstName} ${formData.lastName}`}</div>
            </td>
            <td style={{display: "flex", justifyContent: "flex-end", paddingTop: 40}}>
              <div style={{display: "flex", justifyContent: "space-between", width: 200}}>
                <div>Order Date:</div>
                <div>{util.formatDate(formData.invoiceDate, "DD MMM YYYY")}</div>
              </div>
            </td>
          </tr>
          <tr style={{background: "none"}}>
            <td colSpan={2} style={{paddingTop: 16}}>
              <table style={{width: "100%"}}>
                <thead>
                  <tr style={{background: "#363535", color: "white", height: 34}}>
                    <td style={{width: 40, textAlign: "center"}}>#</td>
                    <td>Item & Description</td>
                    <td style={{textAlign: "right"}}>Qty</td>
                    <td style={{textAlign: "right", width: 100}}>Rate</td>
                    <td style={{textAlign: "right", paddingRight: 10, width: 150}}>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    formData.transactionEntries.map((entry, index) =>
                      <tr key={index} style={{background: "none", verticalAlign: "top"}}>
                        <td style={{textAlign: "center", padding: 4}}>{index + 1}</td>
                        <td style={{padding: 4}}>
                          <pre style={{fontSize: "11pt", fontFamily: "enfont,khfont", whiteSpace: "pre-wrap", border: "none", marginBottom: 0}}>
                            {entry.description}
                          </pre>
                        </td>
                        <td style={{padding: 4, textAlign: "right"}}>{entry.quantity}</td>
                        <td style={{textAlign: "right", padding: 4}}>{util.formatCurrency(entry.price, "")}</td>
                        <td style={{textAlign: "right", padding: 4, paddingRight: 9}}>{util.formatCurrency(entry.quantity * util.floor(entry.price), "")}</td>
                      </tr>
                    )
                  }
                  <tr style={{background: "none", height: 34}}>
                    <td colSpan={2}></td>
                    <td colSpan={2} style={{textAlign: "right", paddingRight: 40}}>Sub Total</td>
                    <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(formData.totalExcludeTax)}</td>
                  </tr>
                  {
                    discount ? 
                      <tr style={{background: "none", height: 34}}>
                        <td colSpan={2}></td>
                        <td colSpan={2} style={{textAlign: "right", paddingRight: 40}}>Discount</td>
                        <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(discount)}</td>
                      </tr>
                    : null
                  }
                  {
                    tax ?
                      <tr style={{background: "none", height: 34}}>
                        <td colSpan={2}></td>
                        <td colSpan={2} style={{textAlign: "right", paddingRight: 40}}>
                          VAT({Math.round(util.getTaxRate(formData.totalExcludeTax - discount, tax))}%)
                        </td>
                        <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(tax)}</td>
                      </tr>
                    : null
                  }
                  <tr style={{background: "none", height: 38}}>
                    <td colSpan={2}></td>
                    <td colSpan={2} style={{background: "#faf9f9", textAlign: "right", paddingRight: 40}}>Total</td>
                    <td style={{textAlign: "right", paddingRight: 10, background: "#faf9f9"}}>${util.formatCurrency(formData.total - discount, "")}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

Template.defaultProps = {
  formData: {
    number: "SO-00008",
    companyName: "CA",
    saleOrderDate: "2022-08-24",
    subTotal: 0,
    total: 0,
    transactionEntries: []
  }
};