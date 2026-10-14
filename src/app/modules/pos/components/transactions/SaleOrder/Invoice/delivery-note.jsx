import React from "react";
import Util from "../../../../../common/util";
import BusinessLogo from "../../Invoice/template/BusinessLogo";
import "./delivery-note.css";

const DeliveryNote = React.forwardRef((props, ref) => {
  const util = new Util();
  const setting = util.getSetting() || {};
  const formData = props.formData || DeliveryNote.defaultProps.formData;
  const entries = Array.isArray(formData.transactionEntries)
    ? formData.transactionEntries.filter(entry => Number(entry.status) !== 3)
    : [];
  const invoices = Array.isArray(formData.invoices) ? formData.invoices : [];
  const invoice = invoices.find(value => value && value.invoiceNumber) || invoices.find(Boolean) || {};
  const orderDateValue = formData.orderDate || formData.registerDate;
  const orderDate = orderDateValue ? util.formatDate(orderDateValue, "DD MMM YYYY") : "—";
  const deliveryDate = formData.expectedShipmentDate
    ? util.formatDate(formData.expectedShipmentDate, "DD MMM YYYY hh:mm A")
    : "—";
  const provider = formData.fulfillmentProviderName
    || formData.fulfillmentProvider
    || formData.shippingProviderName
    || formData.shippingProvider
    || formData.deliveryProvider
    || "";
  const customerName = [formData.firstName, formData.lastName].filter(Boolean).join(" ") || formData.company || "Customer";

  return (
    <article ref={ref} className="so-delivery-note-sheet">
      <header className="so-delivery-note-header">
        <div className="so-delivery-note-business">
          <BusinessLogo
            clientId={formData.clientId || util.getClientId()}
            logo={formData.client && formData.client.logo || util.getClientLogo()}
            businessName={setting.businessName || formData.client && formData.client.businessName}
            className="so-delivery-note-logo"
            imageStyle={{width: 48, height: 48}}
            placeholderStyle={{width: 48, height: 48, fontSize: 16}}
          />
          <div>
            <strong>{setting.businessName || formData.client && formData.client.businessName || "Business"}</strong>
            {setting.address && <div className="so-delivery-note-business-address" dangerouslySetInnerHTML={{__html: setting.address}} />}
            <div className="so-delivery-note-business-contact">
              {setting.phoneNumber && <span>{setting.phoneNumber}</span>}
              {setting.email && <span>{setting.email}</span>}
            </div>
          </div>
        </div>
        <div className="so-delivery-note-title">
          <span>Order fulfillment</span>
          <h1>Delivery Note</h1>
          <strong>{formData.number || "—"}</strong>
        </div>
      </header>

      <section className="so-delivery-note-meta" aria-label="Delivery information">
        <div><span>Invoice number</span><strong>{invoice.invoiceNumber || "—"}</strong></div>
        <div><span>Order number</span><strong>{formData.number || "—"}</strong></div>
        <div><span>Order date</span><strong>{orderDate}</strong></div>
        <div><span>Delivery date</span><strong>{deliveryDate}</strong></div>
      </section>

      <section className="so-delivery-note-parties">
        <div className="so-delivery-note-party">
          <span className="so-delivery-note-label">វិក័យបត្រទៅ / Invoice to</span>
          <strong>{formData.company || customerName}</strong>
          {formData.company && <span>{customerName}</span>}
          {(formData.address || formData.shippingAddress) && <span>{formData.address || formData.shippingAddress}</span>}
          {(formData.phoneNumber || formData.shippingContact1) && <span>Phone: {formData.phoneNumber || formData.shippingContact1}</span>}
        </div>
        <div className="so-delivery-note-party">
          <span className="so-delivery-note-label">ដឹកទៅ / Ship to</span>
          <strong>{formData.shippingRecipientName || customerName}</strong>
          <span>{formData.shippingAddress || formData.address || "Address not provided"}</span>
          {(formData.shippingContact1 || formData.phoneNumber) && <span>Phone: {formData.shippingContact1 || formData.phoneNumber}</span>}
          {formData.shippingContact2 && <span>Alternate phone: {formData.shippingContact2}</span>}
          {provider && <span className="so-delivery-note-provider">Provider: {provider}</span>}
          {formData.shippingDetail && <span>Instructions: {formData.shippingDetail}</span>}
        </div>
      </section>

      <section className="so-delivery-note-items-section">
        <div className="so-delivery-note-section-heading">
          <h2>Items for Delivery</h2>
          <span>{entries.length} line{entries.length === 1 ? "" : "s"}</span>
        </div>
        <table className="so-delivery-note-items">
          <thead>
            <tr>
              <th className="so-delivery-note-index">#</th>
              <th>Item description</th>
              <th className="so-delivery-note-qty">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {entries.length ? entries.map((entry, index) => (
              <tr key={entry.id || `${entry.itemName || entry.description || "item"}-${index}`}>
                <td className="so-delivery-note-index">{String(index + 1).padStart(2, "0")}</td>
                <td>
                  <strong>{entry.itemName || entry.description || "Unnamed item"}</strong>
                  {entry.variantName && <span className="so-delivery-note-variant">{entry.variantName}</span>}
                </td>
                <td className="so-delivery-note-qty"><strong>{entry.quantity || 0}</strong>{entry.unitName && <span>{entry.unitName}</span>}</td>
              </tr>
            )) : <tr><td colSpan="3" className="so-delivery-note-empty">No items are recorded for this order.</td></tr>}
          </tbody>
        </table>
      </section>

      {formData.publicNote && (
        <section className="so-delivery-note-instructions">
          <span className="so-delivery-note-label">Delivery instructions</span>
          <div dangerouslySetInnerHTML={{__html: formData.publicNote}} />
        </section>
      )}

      <footer className="so-delivery-note-signatures">
        <div><span>អ្នកដឹក / Delivered by</span><i /><small>Name / Signature / Date</small></div>
        <div><span>អ្នកទទួល / Received by</span><i /><small>Name / Signature / Date</small></div>
      </footer>
    </article>
  );
});

DeliveryNote.displayName = "DeliveryNote";

export default DeliveryNote;

DeliveryNote.defaultProps = {
  formData: {
    number: "",
    companyName: "",
    saleOrderDate: "",
    total: 0,
    transactionEntries: []
  }
};
