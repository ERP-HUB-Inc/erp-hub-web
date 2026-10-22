import React from "react";
import { Alert, Icon, Skeleton, Tooltip } from "antd";
import ProductService from "@services/ItemService";
import useDashboardQuery from "../../../Dashboard/useDashboardQuery";
import "./item-summary.css";

const numericValue = value => typeof value === "number" && Number.isFinite(value) ? value : null;
const countValue = value => {
  const number = numericValue(value);
  return number !== null && number >= 0 && Number.isInteger(number) ? number : null;
};
const displayCount = value => value === null ? "—" : value.toLocaleString();

function SummaryCard({ title, icon, tone, loading, value, suffix, status, children, className = "" }) {
  return (
    <article className={`item-summary-card item-summary-card-${tone} ${className}`} aria-label={title}>
      <Skeleton loading={loading} active title={false} paragraph={{ rows: 3 }}>
        <div className="item-summary-card-heading">
          <h2>{title}</h2>
          <span className="item-summary-icon" aria-hidden="true"><Icon type={icon} /></span>
        </div>
        <div className="item-summary-value-row">
          <strong className="item-summary-value">{value}</strong>
          {suffix && <span className="item-summary-value-suffix">{suffix}</span>}
          {status && <span className="item-summary-status">{status}</span>}
        </div>
        <div className="item-summary-card-footer">
          {children}
        </div>
      </Skeleton>
    </article>
  );
}

export function ItemSummaryCards({ query, formatCurrency }) {
  const { data, loading, error } = query;
  const summary = !loading && !error && data ? data : {};
  const valuation = numericValue(summary.inventoryValuation?.amount);
  const valuationVariantCount = countValue(summary.inventoryValuation?.variantCount);
  const pricing = summary.pricingAndMarginAlerts || {};
  const alerts = countValue(pricing.total);
  const belowCost = countValue(pricing.belowCost);
  const nonPositivePrice = countValue(pricing.nonPositiveSalesPrice);
  const lowStock = countValue(summary.stockHealth?.lowStock);
  const outOfStock = countValue(summary.stockHealth?.outOfStock);
  const stockActions = lowStock !== null && outOfStock !== null ? lowStock + outOfStock : null;
  const incoming = summary.incomingStock || {};
  const quantity = numericValue(incoming.quantity);
  const purchaseOrders = countValue(incoming.purchaseOrderCount);
  const variants = countValue(incoming.variantCount);
  const noIncoming = quantity === 0 && purchaseOrders === 0;

  return (
    <section className="item-summary" aria-label="Inventory summary" aria-busy={loading}>
      {error && <Alert type="error" showIcon message="Unable to load inventory summary. Use the item list Refresh button to try again." />}
      <div className="item-summary-grid">
        <SummaryCard title="Total Inventory Valuation" icon="wallet" className="item-summary-valuation-card" tone="teal" loading={loading}
          value={valuation === null ? "—" : formatCurrency(valuation)}>
          <p className="item-summary-muted"><Icon type="appstore" /> <strong>{displayCount(valuationVariantCount)}</strong> {valuationVariantCount === 1 ? "product variation" : "product variations"}</p>
          <p className="item-summary-valuation-tip" role="note">
            <Icon type={summary.inventoryValuation?.method === "PRODUCT_VARIANT_COST" ? "bulb" : "info-circle"} aria-hidden="true" />
            <span>{summary.inventoryValuation?.method === "PRODUCT_VARIANT_COST" ? <><strong>Tip: </strong>Stock value at cost</> : "Valuation method unavailable"}</span>
          </p>
        </SummaryCard>
        <SummaryCard title="Pricing & Margin Health" icon="dollar" className="item-summary-pricing-card" tone={alerts === null ? "neutral" : alerts > 0 ? "red" : "teal"} loading={loading}
          value={displayCount(alerts)} suffix={alerts === null ? undefined : alerts === 1 ? "Alert" : "Alerts"}
          status={alerts === null ? "Unavailable" : alerts > 0 ? "Action required" : "Healthy"}>
          <div className="item-summary-breakdown item-summary-pricing-panels" role="group" aria-label="Pricing alerts">
            <div className="item-summary-pricing-below-cost">
              <span className="item-summary-stock-label">
                <span className="item-summary-stock-dot" aria-hidden="true" />
                <span>Below cost</span>
              </span>
              <strong>{displayCount(belowCost)}</strong>
            </div>
            <div className="item-summary-pricing-non-positive">
              <span className="item-summary-stock-label">
                <span className="item-summary-stock-dot" aria-hidden="true" />
                <span>Price ≤ 0</span>
              </span>
              <strong>{displayCount(nonPositivePrice)}</strong>
            </div>
          </div>
          <p className="item-summary-pricing-tip" role="note">
            <Icon type={alerts > 0 ? "bulb" : alerts === 0 ? "check-circle" : "info-circle"} aria-hidden="true" />
            <span>{alerts > 0 && <strong>Tip: </strong>}{alerts === null ? "Pricing health unavailable" : alerts > 0 ? "Review pricing and margins" : "No pricing alerts"}</span>
            <Tooltip title="The total is reported by the API. Conditions may overlap, so breakdowns are not added together. Non-positive sales prices are zero or negative, not necessarily missing prices.">
              <Icon type="info-circle" aria-label="About pricing alert counts" tabIndex={0} />
            </Tooltip>
          </p>
        </SummaryCard>
        <SummaryCard title="Stock Health & Deficits" icon="solution" className="item-summary-stock-card" tone={stockActions === null ? "neutral" : stockActions > 0 ? "amber" : "teal"} loading={loading}
          value={displayCount(stockActions)} suffix={stockActions === null ? undefined : "Action required"}
          status={stockActions === null ? "Unavailable" : stockActions === 0 ? "Healthy" : undefined}>
          <div className="item-summary-breakdown item-summary-stock-panels" role="group" aria-label="Stock alerts">
            <div className="item-summary-stock-out">
              <span className="item-summary-stock-label">
                <span className="item-summary-stock-dot" aria-hidden="true" />
                <span>Out of Stock</span>
              </span>
              <strong>{displayCount(outOfStock)}</strong>
            </div>
            <div className="item-summary-stock-low">
              <span className="item-summary-stock-label">
                <span className="item-summary-stock-dot" aria-hidden="true" />
                <span>Low Stock</span>
              </span>
              <strong>{displayCount(lowStock)}</strong>
            </div>
          </div>
          <p className="item-summary-stock-tip" role="note">
            <Icon type={stockActions === null ? "info-circle" : stockActions === 0 ? "check-circle" : "bulb"} aria-hidden="true" />
            <span>{stockActions > 0 && <strong>Tip: </strong>}{stockActions === null ? "Stock health unavailable" : stockActions === 0 ? "No stock alerts" : "Review stock levels and reorder needs"}</span>
          </p>
        </SummaryCard>
        <SummaryCard title="Incoming Purchase Orders" icon="car" tone="blue" loading={loading}
          value={quantity === null ? "—" : quantity.toLocaleString()} suffix={quantity === null ? undefined : "Quantity"}>
          <div className="item-summary-breakdown">
            <div><span>Open purchase orders</span><strong>{displayCount(purchaseOrders)}</strong></div>
            <div><span>Variants</span><strong>{displayCount(variants)}</strong></div>
          </div>
          {(quantity === null || purchaseOrders === null || noIncoming) && (
            <p className="item-summary-muted"><Icon type={noIncoming ? "inbox" : "info-circle"} /> {quantity === null || purchaseOrders === null ? "Incoming stock unavailable" : "No incoming purchase orders"}</p>
          )}
        </SummaryCard>
      </div>
    </section>
  );
}

export default function ItemSummary({ locationId, refreshKey, formatCurrency, onAlertCountsChange }) {
  const query = useDashboardQuery(() => ProductService.getSummary({ locationId }), [locationId, refreshKey]);
  React.useEffect(() => {
    if (onAlertCountsChange) {
      onAlertCountsChange(
        countValue(query.data?.lowStockAlert),
        countValue(query.data?.marginReviewAlert)
      );
    }
  }, [query.data, onAlertCountsChange]);
  return <ItemSummaryCards query={query} formatCurrency={formatCurrency} />;
}
