import React from "react";
import { Button, Icon, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { grossProfitMetrics, periodInsight, productName, profitBadge, unitComparison } from "./purchaseSalesModel";
import { moneyText, numberText, signedQuantity } from "./purchaseSalesFormatters";

function ProductCell({ row }) {
  return (
    <div className="purchase-sales-product">
      <span className="purchase-sales-product-icon"><Icon type="appstore" /></span>
      <div>
        <strong>{productName(row)}</strong>
        <div className="purchase-sales-product-meta">
          <span className="purchase-sales-sku">{row.sku || "No SKU"}</span>
          {row.categoryName && <span>· {row.categoryName}</span>}
        </div>
      </div>
    </div>
  );
}

function UnitsCell({ row }) {
  const units = unitComparison(row);
  const movementIcon = units.difference > 0 ? "arrow-up" : units.difference < 0 ? "arrow-down" : "minus";
  let note = "Quantities match for this period.";
  if (units.difference === null) note = "Period movement unavailable.";
  else if (units.difference > 0) note = "Purchases exceed sales in this period.";
  else if (units.difference < 0) note = "Sales exceed purchases in this period.";

  return (
    <div className="purchase-sales-units">
      <div className="purchase-sales-unit-labels">
        <span>Bought <strong>{numberText(units.bought)}</strong></span>
        <span>Sold <strong>{numberText(units.sold)}</strong></span>
      </div>
      <div
        className="purchase-sales-unit-bar"
        role="img"
        aria-label={`Bought ${numberText(units.bought)}, sold ${numberText(units.sold)}`}
      >
        <span className="is-bought" style={{ width: `${units.boughtWidth}%` }} />
        <span className="is-sold" style={{ width: `${units.soldWidth}%` }} />
      </div>
      <div className="purchase-sales-movement">
        <Icon type={movementIcon} /> {signedQuantity(units.difference)} net period movement
      </div>
      <div className="purchase-sales-secondary">
        {units.comparable ? note : "Bar unavailable for missing quantities or net returns."}
      </div>
    </div>
  );
}

function FinancialFlowCell({ row, currency }) {
  const profit = grossProfitMetrics(row);
  return (
    <dl className="purchase-sales-financial-flow">
      <dt>Purchased</dt><dd>{moneyText(row.purchaseAmount, currency)}</dd>
      <dt>Sales Revenue</dt>
      <dd className={`purchase-sales-tone is-${row.salesAmount < 0 ? "negative" : "positive"}`}>
        {moneyText(row.salesAmount, currency)}
      </dd>
      <dt>
        <Tooltip title="Inventory cost allocated to the units sold in this period.">
          <span>Sales Cost (COGS)</span>
        </Tooltip>
      </dt>
      <dd className={profit.state === "loss" ? "purchase-sales-tone is-negative" : ""}>
        {moneyText(row.salesCost, currency)}
      </dd>
    </dl>
  );
}

function ProfitCell({ row, currency }) {
  const profit = grossProfitMetrics(row);
  return (
    <div className={`purchase-sales-profit purchase-sales-tone is-${profit.tone}`}>
      <strong>{moneyText(profit.profit, currency, true)}</strong>
      <Tooltip title="Gross margin uses reported gross profit divided by positive sales revenue. Purchase spend is separate from sales cost.">
        <span className={`purchase-sales-badge is-${profit.tone}`}>{profitBadge(profit)}</span>
      </Tooltip>
    </div>
  );
}

function InventoryCell({ row }) {
  const insight = periodInsight(row);
  return (
    <div>
      <span className={`purchase-sales-badge is-${insight.tone}`}>
        <Icon type={insight.icon} /> {insight.label}
      </span>
      <p className="purchase-sales-insight-description">{insight.description}</p>
    </div>
  );
}

function ActionCell({ row }) {
  if (!row.itemId) {
    return <Tooltip title="Item reference unavailable."><Button size="small" disabled>Unavailable</Button></Tooltip>;
  }
  return (
    <Link
      to={`/inventories/items/view/${encodeURIComponent(row.itemId)}?productOption=0`}
      className="ant-btn ant-btn-sm purchase-sales-review"
      aria-label={`View item: ${productName(row)}`}
    >
      <Icon type="eye" /> View Item
    </Link>
  );
}

export const purchaseSalesColumns = currency => [
  {
    title: "Product & SKU",
    key: "product",
    width: 300,
    render: (_, row) => <ProductCell row={row} />
  },
  {
    title: "Units (Bought vs Sold)",
    key: "units",
    width: 240,
    render: (_, row) => <UnitsCell row={row} />
  },
  {
    title: "Financial Flow",
    key: "financialFlow",
    width: 230,
    render: (_, row) => <FinancialFlowCell row={row} currency={currency} />
  },
  {
    title: "Profit & Margin",
    key: "profit",
    width: 190,
    align: "right",
    render: (_, row) => <ProfitCell row={row} currency={currency} />
  },
  {
    title: "Inventory Status & Next Step",
    key: "inventory",
    width: 300,
    render: (_, row) => <InventoryCell row={row} />
  },
  {
    title: "Action",
    key: "action",
    width: 130,
    render: (_, row) => <ActionCell row={row} />
  }
];
