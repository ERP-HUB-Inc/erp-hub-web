import React from "react";
import Util from "../../../../../common/util";

const EMPTY_VALUE = "-";
const WALK_IN_CUSTOMER_ID = "WALK_IN";

function toNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function getBillTo(formData) {
  if (formData.customerId === WALK_IN_CUSTOMER_ID) return "Walk In";
  if (formData.company) return formData.company;

  return [formData.firstName, formData.lastName].filter(Boolean).join(" ") || EMPTY_VALUE;
}

export default function Template(props) {
  const util = new Util();

  const {formData, setting} = props;

  const total = toNumber(formData.total);
  const totalExcludeTax = formData.totalExcludeTax ? toNumber(formData.totalExcludeTax) : total;
  const transactionEntries = Array.isArray(formData.transactionEntries) ? formData.transactionEntries : [];
  let discount = toNumber(formData.discount);
  let deposit = toNumber(formData.deposit);

  let tax = total - totalExcludeTax;
  let grandTotal = total - discount;
  grandTotal  = grandTotal - deposit;

  return (
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      <table style={{width: "100%"}}>
        <tbody>
          <tr style={{background: "none"}}>
            <td>
              <h4>{formData?.client?.businessName}</h4>
              <div style={{width: 460, lineHeight: "28px"}} dangerouslySetInnerHTML={{__html: setting.address}} />
            </td>
            <td style={{textAlign: "right"}}>
              <h2>SALES ORDER</h2>
              <div style={{fontWeight: 600}}>Sales Order# {formData.number}</div>
            </td>
          </tr>
          <tr>
            <td style={{paddingTop: 40}}>
              Bill To <div>{getBillTo(formData)}</div>
            </td>
            <td style={{display: "flex", justifyContent: "flex-end", paddingTop: 40}}>
              <div style={{display: "flex", justifyContent: "space-between", width: 200}}>
                <div>Order Date:</div>
                <div>{util.formatDate(formData.registerDate, "DD MMM YYYY")}</div>
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
                    <td style={{textAlign: "right", width: 100}}>Unit Price</td>
                    <td style={{textAlign: "right", paddingRight: 10, width: 150}}>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    transactionEntries.map((entry, index) => {
                      const quantity = toNumber(entry.quantity);
                      const price = toNumber(entry.price);

                      return (
                        <tr key={entry.id || index} style={{background: "none", verticalAlign: "top"}}>
                          <td style={{textAlign: "center", padding: 4}}>{index + 1}</td>
                          <td style={{padding: 4}}>
                            <pre style={{fontSize: "11pt", fontFamily: "enfont,khfont", whiteSpace: "pre-wrap", border: "none", marginBottom: 0}}>
                              {entry.itemName || EMPTY_VALUE}
                            </pre>
                          </td>
                          <td style={{padding: 4, textAlign: "right"}}>{quantity}</td>
                          <td style={{textAlign: "right", padding: 4}}>{util.formatCurrency(price, "")}</td>
                          <td style={{textAlign: "right", padding: 4, paddingRight: 9}}>{util.formatCurrency(quantity * util.floor(price), "")}</td>
                        </tr>
                      );
                    })
                  }
                  <tr style={{background: "none", height: 34}}>
                    <td colSpan={2}></td>
                    <td colSpan={2} style={{textAlign: "right", paddingRight: 40}}>Subtotal</td>
                    <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(totalExcludeTax)}</td>
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
                          VAT({Math.round(util.getTaxRate(totalExcludeTax - discount, tax))}%)
                        </td>
                        <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(tax)}</td>
                      </tr>
                    : null
                  }
                  {
                    deposit ?
                      <tr style={{background: "none", height: 34}}>
                        <td colSpan={2}></td>
                        <td colSpan={2} style={{textAlign: "right", paddingRight: 40}}>
                          Deposit
                        </td>
                        <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(deposit)}</td>
                      </tr>
                    : null
                  }
                  <tr style={{background: "none", height: 38}}>
                    <td colSpan={2}></td>
                    <td colSpan={2} style={{background: "#faf9f9", textAlign: "right", paddingRight: 40}}>Grand Total</td>
                    <td style={{textAlign: "right", paddingRight: 10, background: "#faf9f9"}}>${util.formatCurrency(grandTotal, "")}</td>
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
