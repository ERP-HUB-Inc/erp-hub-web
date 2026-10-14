import React from "react";
import Util from "../../../../../common/util";
import "./packing-slip.css";

const PackingSlip = React.forwardRef((props, ref) => {
  const util = new Util();
  const setting = util.getSetting() || {};
  const formData = props.formData || PackingSlip.defaultProps.formData;
  const paperSize = ["a5", "80mm", "58mm"].includes(props.paperSize) ? props.paperSize : "a4";
  const entries = Array.isArray(formData.transactionEntries)
    ? formData.transactionEntries.filter(entry => Number(entry.status) !== 3)
    : [];
  const logoName = formData.client && formData.client.logo;
  const logoUrl = logoName && formData.clientId
    ? util.getGeneralImage(`${formData.clientId}/general/${logoName}`).url
    : "";
  const orderDate = formData.registerDate ? util.formatDate(formData.registerDate, "DD MMM YYYY") : "—";

  return (
    <article ref={ref} className={`so-packing-slip-sheet paper-${paperSize}`}>
      <header className="so-packing-slip-header">
        <div className="so-packing-slip-sender-brand">
          {logoUrl
            ? <img className="so-packing-slip-logo" src={logoUrl} alt={`${setting.businessName || "Business"} logo`} />
            : <span className="so-packing-slip-brand-mark" aria-hidden="true">{String(setting.businessName || "B").split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join("").toUpperCase()}</span>}
          <div className="so-packing-slip-business">
            <strong>{setting.businessName || "Business"}</strong>
          </div>
        </div>
        <div className="so-packing-slip-title-block">
          <span className="so-packing-slip-eyebrow">Order fulfillment</span>
          <h1>Packing Slip</h1>
          <strong>{formData.number || "—"}</strong>
          <span>{orderDate}</span>
        </div>
      </header>

      <section className="so-packing-slip-parties">
        <div className="so-packing-slip-party">
          <span className="so-packing-slip-section-label">អ្នកផ្ញើរ / Sender</span>
          <strong>{setting.businessName || "Business"}</strong>
          {setting.address && <div dangerouslySetInnerHTML={{__html: setting.address}} />}
          {setting.phoneNumber && <span>Phone: {setting.phoneNumber}</span>}
        </div>
        <div className="so-packing-slip-party">
          <span className="so-packing-slip-section-label">អ្នកទទួល / Receiver</span>
          <strong>{formData.company || [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "Customer"}</strong>
          <span>{formData.shippingAddress || formData.address || "Address not provided"}</span>
          {(formData.shippingContact1 || formData.phoneNumber) && <span>Phone: {formData.shippingContact1 || formData.phoneNumber}</span>}
          {formData.shippingContact2 && <span>Alternate phone: {formData.shippingContact2}</span>}
        </div>
      </section>

      <section className="so-packing-slip-items-section">
        <div className="so-packing-slip-section-heading">
          <h2>Items to Pack</h2>
          <span>{entries.length} line{entries.length === 1 ? "" : "s"}</span>
        </div>
        <table className="so-packing-slip-items">
          <thead>
            <tr>
              <th className="so-packing-slip-index">#</th>
              <th>Item description</th>
              <th className="so-packing-slip-qty">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {entries.length ? entries.map((entry, index) => (
              <tr key={entry.id || `${entry.itemName || entry.description || "item"}-${index}`}>
                <td className="so-packing-slip-index">{String(index + 1).padStart(2, "0")}</td>
                <td>
                  <strong>{entry.itemName || entry.description || "Unnamed item"}</strong>
                  {entry.variantName && <span className="so-packing-slip-variant">{entry.variantName}</span>}
                </td>
                <td className="so-packing-slip-qty">
                  <strong>{entry.quantity || 0}</strong>
                  {entry.unitName && <span>{entry.unitName}</span>}
                </td>
              </tr>
            )) : <tr><td colSpan="3" className="so-packing-slip-empty">No items are recorded for this order.</td></tr>}
          </tbody>
        </table>
      </section>

      <section className="so-packing-slip-notes">
        <span className="so-packing-slip-section-label">Packing notes</span>
        <p>{formData.note || " "}</p>
      </section>

      <footer className="so-packing-slip-signatures">
        <div><span>Prepared by</span><i /><small>Name / Signature</small></div>
        <div><span>Received by</span><i /><small>Name / Signature</small></div>
      </footer>
    </article>
  );
});

PackingSlip.displayName = "PackingSlip";

PackingSlip.defaultProps = {
  formData: {
    number: "",
    companyName: "",
    saleOrderDate: "",
    total: 0,
    transactionEntries: []
  },
  paperSize: "a4"
};

export default PackingSlip;
