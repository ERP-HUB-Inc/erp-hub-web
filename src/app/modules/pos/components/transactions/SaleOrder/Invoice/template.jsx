import React from "react";
import Util from "../../../../../common/util";
import "./template.css";

const EMPTY_VALUE = "—";
const WALK_IN_CUSTOMER_ID = "WALK_IN";

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getBillTo(formData) {
  if (formData.customerId === WALK_IN_CUSTOMER_ID) return "Walk-In Customer";
  if (formData.company) return formData.company;

  return [formData.firstName, formData.lastName].filter(Boolean).join(" ") || EMPTY_VALUE;
}

export default function Template(props) {
  const util = new Util();
  const formData = props.formData || {};
  const setting = props.setting || {};
  const entries = Array.isArray(formData.transactionEntries)
    ? formData.transactionEntries.filter(entry => Number(entry.status) !== 3)
    : [];
  const total = toNumber(formData.total);
  const subtotal = formData.totalExcludeTax !== null && formData.totalExcludeTax !== undefined
    ? toNumber(formData.totalExcludeTax)
    : total;
  const discount = toNumber(formData.discount);
  const deposit = toNumber(formData.deposit);
  const tax = Math.max(total - subtotal, 0);
  const deliveryFeeValue = formData.fulfillmentProviderId && formData.fulfillmentFee !== null && formData.fulfillmentFee !== undefined && formData.fulfillmentFee !== ""
    ? formData.fulfillmentFee
    : formData.deliveryFee;
  const hasDeliveryFee = deliveryFeeValue !== null && deliveryFeeValue !== undefined && deliveryFeeValue !== "";
  const deliveryFee = hasDeliveryFee ? toNumber(deliveryFeeValue) : 0;
  const grandTotal = total - discount + deliveryFee;
  const balanceDue = Math.max(grandTotal - deposit, 0);
  const businessName = setting.businessName || (formData.client && formData.client.businessName) || "Business";
  const orderDate = formData.registerDate ? util.formatDate(formData.registerDate, "DD MMM YYYY") : EMPTY_VALUE;

  return (
    <article className="so-invoice-preview">
      <header className="so-invoice-header">
        <div className="so-invoice-business">
          <div className="so-invoice-brand-mark" aria-hidden="true">
            {businessName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase() || "B"}
          </div>
          <div className="so-invoice-business-info">
            <h1>{businessName}</h1>
            {setting.address && <div className="so-invoice-business-address" dangerouslySetInnerHTML={{ __html: setting.address }} />}
            <div className="so-invoice-business-contact">
              {setting.phoneNumber && <span>{setting.phoneNumber}</span>}
              {setting.email && <span>{setting.email}</span>}
            </div>
          </div>
        </div>
        <div className="so-invoice-document-heading">
          <span className="so-invoice-kicker">Order document</span>
          <h2>Sales Order</h2>
          <strong>{formData.number || EMPTY_VALUE}</strong>
        </div>
      </header>

      <section className="so-invoice-meta-grid" aria-label="Order information">
        <div className="so-invoice-info-card">
          <span className="so-invoice-label">Bill to</span>
          <strong>{getBillTo(formData)}</strong>
          {formData.phoneNumber && <span>{formData.phoneNumber}</span>}
          {formData.email && <span>{formData.email}</span>}
        </div>
        <div className="so-invoice-info-card">
          <span className="so-invoice-label">Deliver to</span>
          <strong>{formData.shippingAddress || formData.address || EMPTY_VALUE}</strong>
          {formData.fulfillmentProviderName && <span>Via {formData.fulfillmentProviderName}</span>}
        </div>
        <div className="so-invoice-info-card so-invoice-order-date">
          <span className="so-invoice-label">Order date</span>
          <strong>{orderDate}</strong>
          <span>Currency: {formData.currency || "USD"}</span>
        </div>
      </section>

      <section className="so-invoice-items-section" aria-label="Order items">
        <table className="so-invoice-items-table">
          <thead>
            <tr>
              <th className="so-invoice-index">#</th>
              <th>Item &amp; Description</th>
              <th className="so-invoice-number">Qty</th>
              <th className="so-invoice-number">Unit Price</th>
              <th className="so-invoice-number">Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.length ? entries.map((entry, index) => {
              const quantity = toNumber(entry.quantity);
              const price = toNumber(entry.price);
              const amount = entry.amount !== null && entry.amount !== undefined
                ? toNumber(entry.amount)
                : quantity * util.floor(price);
              const sku = entry.sku || entry.barcode || entry.variantSku || entry.productVariantSku;

              return (
                <tr key={entry.id || `${entry.itemName || entry.description || "item"}-${index}`}>
                  <td className="so-invoice-index">{String(index + 1).padStart(2, "0")}</td>
                  <td>
                    <strong className="so-invoice-item-name">{entry.itemName || entry.description || EMPTY_VALUE}</strong>
                    {(sku || entry.variantName || entry.unitName) && (
                      <div className="so-invoice-item-details">
                        {sku && <span>SKU: {sku}</span>}
                        {entry.variantName && <span>{entry.variantName}</span>}
                        {entry.unitName && <span>{entry.unitName}</span>}
                      </div>
                    )}
                  </td>
                  <td className="so-invoice-number">{quantity}</td>
                  <td className="so-invoice-number">{util.formatCurrency(price, "")}</td>
                  <td className="so-invoice-number so-invoice-amount">{util.formatCurrency(amount, "")}</td>
                </tr>
              );
            }) : (
              <tr><td colSpan="5" className="so-invoice-empty">No items were recorded for this order.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="so-invoice-bottom">
        <div className="so-invoice-notes">
          <span className="so-invoice-label">Notes</span>
          <p>{formData.note || "Thank you for your business."}</p>
        </div>
        <div className="so-invoice-totals">
          <div className="so-invoice-total-row"><span>Subtotal</span><strong>{util.formatCurrency(subtotal)}</strong></div>
          {discount > 0 && <div className="so-invoice-total-row is-discount"><span>Discount</span><strong>−{util.formatCurrency(discount)}</strong></div>}
          {tax > 0 && <div className="so-invoice-total-row"><span>Tax</span><strong>{util.formatCurrency(tax)}</strong></div>}
          {hasDeliveryFee && <div className="so-invoice-total-row"><span>Delivery fee</span><strong>{util.formatCurrency(deliveryFeeValue)}</strong></div>}
          <div className="so-invoice-total-row is-grand-total"><span>Grand total</span><strong>{util.formatCurrency(grandTotal)}</strong></div>
          {deposit > 0 && <div className="so-invoice-total-row"><span>Deposit paid</span><strong>{util.formatCurrency(deposit)}</strong></div>}
          <div className="so-invoice-total-row is-balance"><span>Balance due</span><strong>{util.formatCurrency(balanceDue)}</strong></div>
        </div>
      </section>

      <footer className="so-invoice-footer">
        <span>{businessName}</span>
        <span>Sales Order {formData.number || EMPTY_VALUE}</span>
      </footer>
    </article>
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
