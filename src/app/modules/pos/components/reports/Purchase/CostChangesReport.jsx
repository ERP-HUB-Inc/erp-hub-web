import React from "react";
import {
  Alert, Button, Card, Col, Icon, Input, Pagination, Row, Skeleton, Table, Tooltip
} from "antd";
import { Link } from "react-router-dom";
import Util from "../../../../common/util";
import { pageSize, quantity } from "./purchaseReportConfig";
import {
  batchImpact,
  costAlertKey,
  costCategories,
  costCategory,
  costProductName,
  filterCostRows,
  finiteNumber,
  grossMarginComparison,
  groupCostRows
} from "./costChangesModel";

const util = new Util();
const money = value => finiteNumber(value) === null ? "—" : util.formatCurrency(Number(value));
const signedMoney = value => finiteNumber(value) === null ? "—" : `${value > 0 ? "+" : ""}${money(value)}`;
const percent = value => finiteNumber(value) === null
  ? "—"
  : `${value > 0 ? "+" : ""}${Number(value).toFixed(1)}%`;
const statusLabels = {
  increased: "Hike",
  decreased: "Cost Decreased",
  stable: "Stable",
  unavailable: "No baseline"
};

function ProductCell({ row, threshold }) {
  const status = costCategory(row, threshold);
  const icon = status === "increased" ? "rise" : status === "decreased" ? "fall" : "appstore";
  return (
    <div className="cost-product">
      <span className={`cost-product-icon is-${status}`}><Icon type={icon} /></span>
      <div className="cost-product-description">
        <div className="cost-product-name">
          <strong>{costProductName(row)}</strong>
          <span className={`cost-status is-${status}`}>{statusLabels[status]}</span>
        </div>
        <div className="cost-secondary">
          {row.sku || "No SKU"}{row.supplierName ? ` · ${row.supplierName}` : ""}
        </div>
      </div>
    </div>
  );
}

function VarianceCell({ row, threshold }) {
  const category = costCategory(row, threshold);
  if (category === "unavailable") {
    return <span title="A positive previous cost and valid comparison are required.">—</span>;
  }
  const descriptor = category === "increased" ? " hike" : category === "decreased" ? " save" : "";
  return (
    <div className={`cost-variance is-${category}`}>
      <strong>{signedMoney(row.changeAmount)}</strong>
      <div>{percent(row.changePercent)}{descriptor}</div>
    </div>
  );
}

const marginPercent = value => `${value.toFixed(2)}%`;

function pricingReference(row) {
  const basis = row.pricingBasis === "CURRENT_RETAIL"
    ? "Current retail price"
    : row.pricingBasis || "Pricing basis not provided";
  const sellingPrice = finiteNumber(row.sellingPrice);
  return sellingPrice === null ? basis : `${basis}: ${money(sellingPrice)}`;
}

function MarginCell({ row }) {
  const margin = grossMarginComparison(row);
  if (margin.current === null) {
    return (
      <Tooltip title="The report has not supplied a valid current gross margin for this product.">
        <span className="cost-secondary">
          — <Icon type="info-circle" />
          <small>Pricing data unavailable</small>
        </span>
      </Tooltip>
    );
  }

  return (
    <div className={`cost-margin is-${margin.tone}`}>
      <Tooltip title={pricingReference(row)}>
        <strong>{marginPercent(margin.current)} <Icon type="info-circle" /></strong>
      </Tooltip>
      <div className="cost-secondary">
        {margin.previous === null ? "Previous margin unavailable" : (
          <>({marginPercent(margin.previous)} {margin.difference === 0 ? "unchanged" : "previous"})</>
        )}
      </div>
    </div>
  );
}

function AlertMargin({ row }) {
  const margin = grossMarginComparison(row);
  if (margin.current === null) {
    return <small>Current gross margin is unavailable for this product.</small>;
  }

  return (
    <small className="cost-alert-margin">
      Current gross margin: <strong className={`is-${margin.tone}`}>{marginPercent(margin.current)}</strong>
      {margin.previous !== null && ` (previously ${marginPercent(margin.previous)}).`}
      {" "}<span>{pricingReference(row)}.</span>
    </small>
  );
}

function costColumns(threshold) {
  return [
    {
      title: "Product & SKU",
      key: "product",
      width: 340,
      render: (_, row) => <ProductCell row={row} threshold={threshold} />
    },
    {
      title: "Batch Inbound Qty",
      key: "quantity",
      width: 170,
      align: "right",
      render: (_, row) => (
        <div>
          <strong>{quantity(row.currentQuantity)}{row.unitName ? ` ${row.unitName}` : ""}</strong>
          <div className="cost-secondary">({quantity(row.previousQuantity)} previous)</div>
        </div>
      )
    },
    {
      title: "Previous Cost",
      dataIndex: "previousCost",
      key: "previousCost",
      width: 140,
      align: "right",
      render: value => <span className="cost-secondary">{money(value)}</span>
    },
    {
      title: "Current Cost",
      key: "currentCost",
      width: 140,
      align: "right",
      render: (_, row) => (
        <strong className={`is-${costCategory(row, threshold)}`}>{money(row.currentCost)}</strong>
      )
    },
    {
      title: "Variance ($ & %)",
      key: "variance",
      width: 170,
      align: "right",
      render: (_, row) => <VarianceCell row={row} threshold={threshold} />
    },
    {
      title: "Gross Margin Impact",
      key: "margin",
      width: 190,
      align: "right",
      render: (_, row) => <MarginCell row={row} />
    }
  ];
}

function CostCards({ summary, groups, threshold, loading }) {
  const increases = groups.increased.map(row => Number(row.changePercent));
  const maximum = increases.length ? increases.reduce((max, value) => Math.max(max, value)) : null;
  const exposure = batchImpact(groups.increased);
  const savings = batchImpact(groups.decreased);
  const cards = [
    {
      title: "Affected SKUs",
      value: summary.affectedProducts,
      icon: "appstore",
      detail: "Monitored item total unavailable"
    },
    {
      title: "Cost Increased",
      value: summary.increasedProducts,
      icon: "rise",
      tone: "increased",
      badge: maximum === null ? null : `${percent(maximum)} Max`,
      detail: exposure === null
        ? "Batch exposure unavailable"
        : `${signedMoney(exposure)} est. batch exposure (listed SKUs)`
    },
    {
      title: "Cost Decreased",
      value: summary.decreasedProducts,
      icon: "fall",
      tone: "decreased",
      detail: savings === null
        ? "Batch savings unavailable"
        : `${money(Math.abs(savings))} est. batch savings (listed SKUs)`
    },
    {
      title: "Stable / Unchanged",
      value: summary.unchangedProducts,
      icon: "check-circle",
      detail: `Reported unchanged count · band ±${threshold}%`
    }
  ];
  return (
    <Row gutter={16} className="cost-card-grid">
      {cards.map(card => (
        <Col key={card.title} xs={24} sm={12} lg={6}>
          <Card className={`cost-card is-${card.tone || "neutral"}`}>
            <Skeleton active loading={loading} title={false} paragraph={{ rows: 3 }}>
              <div className="cost-card-heading">{card.title}<Icon type={card.icon} /></div>
              <div className="cost-card-value">
                <strong>{quantity(finiteNumber(card.value))}</strong>
                {card.badge && <span className="cost-status is-increased">{card.badge}</span>}
              </div>
              <div className="cost-secondary">{card.detail}</div>
            </Skeleton>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function PriceHikeAlert({ rows, context, loading }) {
  const [dismissedKey, setDismissedKey] = React.useState(null);
  if (!rows.length || loading) return null;
  const key = costAlertKey(rows, context);
  if (dismissedKey === key) return null;
  const product = rows.reduce((highest, row) => (
    Number(row.changePercent) > Number(highest.changePercent) ? row : highest
  ));
  const updatePath = product.itemId ? `/inventories/items/update/${encodeURIComponent(product.itemId)}` : null;
  const search = product.productOption ? `?productOption=${encodeURIComponent(product.productOption)}` : "";
  return (
    <div className="cost-hike-alert" role="status">
      <Icon type="warning" className="cost-alert-icon" />
      <div className="cost-alert-message">
        <strong>Price Hike Alert: </strong>
        <span className="cost-alert-product">{costProductName(product)}</span> rose <strong>{percent(product.changePercent)}</strong>
        {` (${money(product.previousCost)} → ${money(product.currentCost)}).`}
        {rows.length > 1 && ` ${quantity(rows.length - 1)} more listed SKUs have qualifying increases.`}
        <AlertMargin row={product} />
      </div>
      {updatePath && (
        <Link className="ant-btn cost-price-link" to={`${updatePath}${search}`}>
          <Icon type="edit" /> Update Retail Price
        </Link>
      )}
      <Button
        type="link"
        icon="close"
        aria-label="Dismiss price hike alert"
        onClick={() => setDismissedKey(key)}
      />
    </div>
  );
}

export default function CostChangesReport({ report, filters, onRefresh }) {
  const [category, setCategory] = React.useState("affected");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const groups = groupCostRows(rows, filters.minChangePercent);
  const matchingGroups = groupCostRows(filterCostRows(rows, search), filters.minChangePercent);
  const visibleRows = matchingGroups[category];
  const lastPage = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(page, lastPage);
  const visibleCount = Math.min(pageSize, Math.max(0, visibleRows.length - (currentPage - 1) * pageSize));
  const context = JSON.stringify({ filters, period: report.period });
  const decreasing = filters.minChangePercent < 0;
  const itemLabel = category === "affected" ? "variance-flagged" : category;
  const resultSummary = `Showing ${visibleCount} of ${quantity(visibleRows.length)} ${itemLabel} items`;

  React.useEffect(() => { setPage(1); }, [context]);
  React.useEffect(() => { setCategory("affected"); }, [decreasing]);

  const selectCategory = key => {
    setCategory(key);
    setPage(1);
  };

  const emptyText = groups.unavailable.length === rows.length && rows.length
    ? "No valid comparison baseline is available for the listed products."
    : search ? "No products or SKUs match your search."
      : "No matching SKUs are available. Try another category or adjust the report filters.";

  if (report.error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load cost changes"
        description={
          <>
            <p>{report.error}</p>
            <Button icon="reload" onClick={onRefresh}>Retry</Button>
          </>
        }
      />
    );
  }

  return (
    <div className="cost-changes-report">
      <PriceHikeAlert rows={groups.increased} context={context} loading={report.loading} />
      <CostCards
        summary={report.summary || {}}
        groups={groups}
        threshold={Math.abs(filters.minChangePercent)}
        loading={report.loading}
      />
      <p className="cost-data-note">
        Cards show report summary totals. Product details follow the selected direction and threshold; summary totals may include additional SKUs.
        {groups.unavailable.length > 0 && ` ${quantity(groups.unavailable.length)} SKUs have no valid baseline and are excluded from variance categories.`}
      </p>
      <div className="cost-table-panel">
        <div className="cost-table-toolbar">
          <div className="cost-category-buttons" role="group" aria-label="Cost change category">
            {costCategories.map(item => (
              <Button
                key={item.key}
                className={category === item.key ? "is-selected" : ""}
                aria-pressed={category === item.key}
                onClick={() => selectCategory(item.key)}
                disabled={report.loading}
              >
                {item.key === "increased" && <span className="cost-red-dot" aria-hidden="true" />}
                {item.label} ({report.loading ? "—" : quantity(matchingGroups[item.key].length)})
              </Button>
            ))}
          </div>
          <Input
            className="cost-product-search"
            aria-label="Filter by product or SKU"
            placeholder="Filter by product, SKU…"
            prefix={<Icon type="search" />}
            allowClear
            value={search}
            onChange={event => { setSearch(event.target.value); setPage(1); }}
          />
        </div>
        <Table
          className="purchase-report-table cost-changes-table"
          columns={costColumns(filters.minChangePercent)}
          dataSource={visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey={(row, index) => `${row.itemId || "item"}-${row.variantId || row.sku || index}`}
          pagination={false}
          loading={report.loading}
          scroll={{ x: 1150 }}
          locale={{ emptyText }}
        />
        <div className="cost-table-footer">
          <div className="cost-secondary">
            <div><Icon type="info-circle" /> Weighted Cost = Total Batch Spend ÷ Inbound Qty</div>
            <div aria-live="polite">
              {report.loading ? "Loading results…" : (
                <>{resultSummary}{search ? " matching search" : ""} · {quantity(rows.length)} SKUs available</>
              )}
            </div>
          </div>
          <div className="cost-pagination">
            <span>Page {currentPage} of {lastPage}</span>
            <Pagination
              size="small"
              current={currentPage}
              total={visibleRows.length}
              pageSize={pageSize}
              onChange={setPage}
              disabled={report.loading}
            />
          </div>
        </div>
      </div>
      <p className="cost-data-note">
        Increased / decreased include the exact ±{Math.abs(filters.minChangePercent)}% boundary.
        Stable is inside that band; zero change is always stable. A positive previous cost is required.
      </p>
    </div>
  );
}
