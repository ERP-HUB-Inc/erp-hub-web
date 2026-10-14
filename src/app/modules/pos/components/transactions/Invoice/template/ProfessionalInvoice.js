import React from "react";
import Util from "../../../../../common/util";
import BusinessLogo from "./BusinessLogo";
import "./professional-invoice.css";

const util = new Util();

export default function ProfessionalInvoice({formData = {}, variant = "standard"}) {
  const compact = variant === "compact" || variant === "professional-compact";
  const entries = (formData.transactionEntries || []).filter(entry => entry && entry.status !== 3);
  const subtotal = entries.reduce((sum, entry) => sum + Number(entry.quantity || 0) * Number(entry.price || 0), 0);
  const discount = Number(formData.discount || 0);
  const deliveryFee = Number(formData.deliveryFee || 0);
  const tax = Math.max(0, Number(formData.total || 0) - Number(formData.totalExcludeTax || subtotal));
  const total = Number(formData.total || subtotal) - discount + deliveryFee;
  const deposit = Number(formData.deposit || 0);
  const balanceDue = Math.max(total - deposit, 0);
  const business = formData.client || {};
  const businessName = business.businessName || "Business";
  const date = value => value ? util.formatDate(value, "DD-MM-YYYY") : "—";
  const amount = value => util.formatCurrency(Number.isFinite(value) ? value : 0);

  return <article className={`professional-invoice professional-invoice-${variant} ${compact ? "professional-invoice-compact" : ""}`}>
    <header className="professional-invoice-header">
      <div className="professional-invoice-brand">
        <BusinessLogo clientId={formData.clientId} logo={business.logo} businessName={businessName} />
        <div>
          <h1>{businessName}</h1>
          <div>{business.email || ""}</div>
          <div>{business.phoneNumber ? util.formatPhonenoWithCountryCode(business.phoneNumber) : ""}</div>
          {business.website && <div>{business.website}</div>}
        </div>
      </div>
      <div className="professional-invoice-title">
        <span>INVOICE</span>
        <strong>{formData.invoiceNumber || "—"}</strong>
        <small>{formData.status || ""}</small>
      </div>
    </header>

    <section className="professional-invoice-meta">
      <div>
        <span className="professional-invoice-label">BILL TO</span>
        <strong>{[formData.firstName, formData.lastName].filter(Boolean).join(" ") || formData.company || "Customer"}</strong>
        {formData.company && <span>{formData.company}</span>}
        {formData.phoneNumber && <span>{formData.phoneNumber}</span>}
        {formData.address && <span>{formData.address}</span>}
      </div>
      <div className="professional-invoice-dates">
        <div><span>Invoice date</span><strong>{date(formData.invoiceDate)}</strong></div>
        <div><span>Due date</span><strong>{date(formData.dueDate)}</strong></div>
      </div>
    </section>

    <table className="professional-invoice-items">
      <thead><tr><th>#</th><th>Item description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead>
      <tbody>{entries.map((entry, index) => <tr key={entry.id || `${entry.description}-${index}`}>
        <td>{index + 1}</td>
        <td><strong>{entry.description || entry.itemName || "Item"}</strong>{entry.sku && <small>SKU: {entry.sku}</small>}</td>
        <td>{entry.quantity || 0}</td>
        <td>{amount(Number(entry.price || 0))}</td>
        <td>{amount(Number(entry.quantity || 0) * Number(entry.price || 0))}</td>
      </tr>)}</tbody>
    </table>

    <section className="professional-invoice-bottom">
      <div className="professional-invoice-note">
        {formData.publicNote && <><span className="professional-invoice-label">NOTE</span><div dangerouslySetInnerHTML={{__html: formData.publicNote}} /></>}
      </div>
      <div className="professional-invoice-totals">
        <div><span>Subtotal</span><strong>{amount(subtotal)}</strong></div>
        {discount > 0 && <div className="professional-invoice-discount"><span>Discount</span><strong>−{amount(discount)}</strong></div>}
        {tax > 0 && <div><span>Tax</span><strong>{amount(tax)}</strong></div>}
        {deliveryFee > 0 && <div><span>Delivery</span><strong>{amount(deliveryFee)}</strong></div>}
        <div className="professional-invoice-grand-total"><span>Total</span><strong>{amount(total)}</strong></div>
        {deposit > 0 && <div><span>Deposit paid</span><strong>−{amount(deposit)}</strong></div>}
        <div className="professional-invoice-balance-due"><span>Balance due</span><strong>{amount(balanceDue)}</strong></div>
      </div>
    </section>
    <footer className="professional-invoice-footer">Thank you for your business.</footer>
  </article>;
}
