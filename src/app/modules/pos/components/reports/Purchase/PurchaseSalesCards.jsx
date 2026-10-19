import React from "react";
import { Card, Icon, Skeleton, Tooltip } from "antd";
import { finiteNumber } from "./costChangesModel";
import { grossProfitMetrics, profitBadge, purchaseSalesActivities } from "./purchaseSalesModel";
import { moneyText, numberText, signedQuantity } from "./purchaseSalesFormatters";

function SummaryCard({ title, icon, tone, loading, children }) {
  return (
    <Card className={`purchase-sales-card is-${tone}`}>
      <Skeleton active loading={loading} title={false} paragraph={{ rows: 4 }}>
        <div className="purchase-sales-card-heading">
          <span>{title}</span>
          <span className="purchase-sales-icon-tile"><Icon type={icon} /></span>
        </div>
        {children}
      </Skeleton>
    </Card>
  );
}

function StockHealthCard({ loading, stockHealth }) {
  const signals = [
    { key: "sellingFastProducts", label: "Selling Fast", tone: "warning" },
    { key: "overstockProducts", label: "Too Much Stock", tone: "blue" },
    { key: "newRestockProducts", label: "New Restock", tone: "positive" }
  ].map(signal => ({ ...signal, count: finiteNumber(stockHealth[signal.key]) }));
  const hasUnavailableCounts = signals.some(signal => signal.count === null);
  return (
    <SummaryCard title="Stock Alerts & Health" icon="control" tone="neutral" loading={loading}>
      <p className="purchase-sales-secondary">Quick product status</p>
      <div className="purchase-sales-health-tiles">
        {signals.map(signal => (
          <Tooltip
            key={signal.key}
            title={signal.count === null
              ? "Inventory signal count is unavailable."
              : "Products flagged by the inventory policy for the selected report filters."}
          >
            <div className={`purchase-sales-health-tile is-${signal.tone}`}>
              <strong aria-label={`${signal.label}: ${signal.count === null ? "unavailable" : numberText(signal.count)}`}>
                {signal.count === null ? "—" : numberText(signal.count)}
              </strong>
              <span>{signal.label}</span>
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="purchase-sales-secondary">
        {hasUnavailableCounts ? "Some inventory signals unavailable" : "Counts for the selected report filters"}
      </div>
    </SummaryCard>
  );
}

export default function PurchaseSalesCards({ summary, loading }) {
  const profit = grossProfitMetrics(summary);
  const currency = summary.currencyCode;
  const reportedProfit = finiteNumber(summary.grossProfit);
  const ratio = finiteNumber(summary.purchaseSalesRatio);
  let profitDescription = "Gross profit unavailable";
  if (reportedProfit !== null) {
    profitDescription = reportedProfit < 0 ? "Gross loss recorded" : reportedProfit > 0 ? "Realized gross profit" : "No gross profit earned";
  }

  return (
    <>
      <div className="purchase-sales-cards">
        <SummaryCard title="Sales Revenue" icon="dollar" tone={summary.salesAmount < 0 ? "negative" : "positive"} loading={loading}>
          <div className="purchase-sales-card-value">{moneyText(summary.salesAmount, currency)}</div>
          <div className="purchase-sales-card-footer">
            <span className="purchase-sales-badge is-positive">
              <Icon type="shopping" /> {numberText(summary.salesQuantity)} units sold
            </span>
            <span>Across {numberText(summary.productCount)} products</span>
          </div>
        </SummaryCard>

        <SummaryCard title="Purchase Spend" icon="car" tone="blue" loading={loading}>
          <div className="purchase-sales-card-value">{moneyText(summary.purchaseAmount, currency)}</div>
          <div className="purchase-sales-card-footer">
            <span className="purchase-sales-badge is-blue">
              <Icon type="inbox" /> {numberText(summary.purchaseQuantity)} units purchased
            </span>
            <span>In this period</span>
          </div>
        </SummaryCard>

        <SummaryCard title="Gross Profit" icon={reportedProfit < 0 ? "fall" : "rise"} tone={profit.tone} loading={loading}>
          <div className="purchase-sales-card-value">{moneyText(summary.grossProfit, currency, true)}</div>
          <div className="purchase-sales-card-footer">
            <span className={`purchase-sales-badge is-${profit.tone}`}>{profitBadge(profit)}</span>
            <span><Icon type={reportedProfit < 0 ? "warning" : "info-circle"} /> {profitDescription}</span>
          </div>
          <div className="purchase-sales-secondary">
            Sales Cost (COGS): {moneyText(summary.salesCost, currency)}
          </div>
        </SummaryCard>

        <StockHealthCard loading={loading} stockHealth={summary.stockHealth || {}} />
      </div>
      <div className="purchase-sales-period-summary">
        <span>Purchase / Sales: <strong>{loading || ratio === null ? "—" : `${ratio.toFixed(2)}%`}</strong></span>
        <span>Net period quantity: <strong>{loading ? "—" : signedQuantity(summary.quantityDifference)}</strong></span>
        <span>Purchase spend − revenue: <strong>{loading ? "—" : moneyText(summary.amountDifference, currency, true)}</strong></span>
        {purchaseSalesActivities.filter(item => item.summaryKey).map(item => (
          <span key={item.key}>{item.label}: <strong>{loading ? "—" : numberText(summary[item.summaryKey])}</strong></span>
        ))}
      </div>
    </>
  );
}
