import React from "react";
import { Alert, Button, Card, Icon, Input, Pagination, Skeleton, Table, Tooltip } from "antd";
import { Link } from "react-router-dom";
import Util from "../../../../common/util";
import { finiteNumber } from "./costChangesModel";
import { pageSize, quantity } from "./purchaseReportConfig";
import {
  filterStockRows,
  groupStockRows,
  stockCoverage,
  stockPageRange,
  stockProductName,
  stockRiskCategories,
  stockRiskCategory,
  stockRiskLabel,
  stockValuation
} from "./stockRiskModel";

const numberText = value => quantity(finiteNumber(value));
const util = new Util();

function StockTiedCapital({ summary }) {
  const valuation = stockValuation(summary);
  const tooltip = valuation.unavailableReason || "Estimated tied capital: excess stock valued at product variant cost.";
  const value = valuation.unavailableReason
    ? "—"
    : util.formatCurrency(valuation.amount, `${valuation.currency} `);

  return (
    <div className="stock-risk-capital">
      <span>Tied capital</span>
      <Tooltip title={tooltip}>
        <span>
          <strong>
            {!valuation.unavailableReason && <span aria-label="Approximately">≈ </span>}
            {value}
          </strong>{" "}
          <Icon type="info-circle" />
        </span>
      </Tooltip>
    </div>
  );
}

function StockRiskCards({ summary, threshold, loading }) {
  const cards = [
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: "database",
      unit: "SKUs",
      tone: "neutral",
      description: "Inventory in the report scope"
    },
    {
      title: "Healthy Stock",
      value: summary.normalProducts,
      icon: "check-circle",
      tone: "healthy",
      badge: summary.normalProducts > 0 ? "Balanced" : null,
      description: "Normal under the current stock policy"
    },
    {
      title: "Overstock Alert",
      value: summary.highRiskProducts,
      icon: "warning",
      tone: "high",
      badge: summary.highRiskProducts > 0 ? "Review" : null,
      description: `High risk · ${threshold}-day coverage policy`
    },
    {
      title: "Dead Stock Risk",
      value: summary.criticalRiskProducts,
      icon: "safety-certificate",
      tone: "critical",
      badge: summary.criticalRiskProducts > 0 ? "Urgent" : null,
      description: "Critical under the current stock policy"
    },
    {
      title: "Total Excess Units",
      value: summary.totalExcessStock,
      icon: "dollar",
      tone: "excess",
      description: "Reported quantity · unit basis unavailable"
    }
  ];

  return (
    <div className="stock-risk-cards">
      {cards.map(card => (
        <Card key={card.title} className={`stock-risk-card is-${card.tone}`}>
          <Skeleton active loading={loading} title={false} paragraph={{ rows: 3 }}>
            <div className="stock-risk-card-heading">
              <span>{card.title}</span>
              <span className="stock-risk-icon-tile"><Icon type={card.icon} /></span>
            </div>
            <div className="stock-risk-card-value">
              <strong>{numberText(card.value)}</strong>
              {card.unit && <span>{card.unit}</span>}
            </div>
            <div className="stock-risk-card-detail">
              {card.badge && <span className={`stock-risk-badge is-${card.tone}`}>{card.badge}</span>}
              <span>{card.description}</span>
            </div>
            {card.tone === "excess" && (
              <StockTiedCapital summary={summary} />
            )}
          </Skeleton>
        </Card>
      ))}
    </div>
  );
}

function StockProductCell({ row }) {
  return (
    <div className="stock-risk-product">
      <span className="stock-risk-product-icon"><Icon type="inbox" /></span>
      <div>
        <strong>{stockProductName(row)}</strong>
        <div className="stock-risk-secondary stock-risk-product-meta">
          <span className="stock-risk-sku">{row.sku || "No SKU"}</span>
          {row.categoryName && <span>· {row.categoryName}</span>}
        </div>
      </div>
    </div>
  );
}

function StockCoverageCell({ row }) {
  const coverage = stockCoverage(row);
  return (
    <div>
      <strong className={`stock-risk-tone is-${stockRiskCategory(row.risk)}`}>{coverage.label}</strong>
      <div className="stock-risk-secondary">{coverage.detail}</div>
    </div>
  );
}

function StockReviewAction({ row }) {
  if (!row.itemId) {
    return (
      <Tooltip title="The product reference required to open item details is unavailable.">
        <Button size="small" disabled>Review unavailable</Button>
      </Tooltip>
    );
  }
  const path = `/inventories/items/view/${encodeURIComponent(row.itemId)}?productOption=0`;
  const label = stockRiskCategory(row.risk) === "healthy" ? "Monitor" : "Review item";
  return (
    <Link
      className="ant-btn ant-btn-sm stock-risk-review"
      to={path}
      aria-label={`${label}: ${stockProductName(row)}`}
    >
      <Icon type="eye" /> {label}
    </Link>
  );
}

const stockColumns = [
  {
    title: "Product & SKU",
    key: "product",
    width: 310,
    render: (_, row) => <StockProductCell row={row} />
  },
  {
    title: "Purchased",
    dataIndex: "purchasedQuantity",
    key: "purchasedQuantity",
    width: 110,
    align: "right",
    render: numberText
  },
  {
    title: "Sold",
    key: "soldQuantity",
    width: 95,
    align: "right",
    render: (_, row) => {
      const noMovement = finiteNumber(row.soldQuantity) === 0 && finiteNumber(row.currentStock) > 0;
      return <span className={noMovement ? "stock-risk-tone is-critical" : ""}>{numberText(row.soldQuantity)}</span>;
    }
  },
  {
    title: "Current Stock",
    dataIndex: "currentStock",
    key: "currentStock",
    width: 125,
    align: "right",
    render: value => <strong>{numberText(value)}</strong>
  },
  {
    title: "Daily Velocity",
    key: "averageDailySales",
    width: 135,
    align: "right",
    render: (_, row) => {
      const velocity = finiteNumber(row.averageDailySales);
      return (
        <span className={`stock-risk-tone is-${stockRiskCategory(row.risk)}`}>
          {velocity === null ? "—" : `${velocity.toFixed(2)}/day`}
        </span>
      );
    }
  },
  {
    title: "Coverage Days",
    key: "stockCoverageDays",
    width: 180,
    align: "right",
    render: (_, row) => <StockCoverageCell row={row} />
  },
  {
    title: "Target Policy",
    key: "thresholdDays",
    width: 150,
    align: "right",
    render: (_, row) => (
      <div>
        <span>{numberText(row.thresholdDays)} Days</span>
        <div className="stock-risk-secondary">Target: {numberText(row.targetStock)}</div>
      </div>
    )
  },
  {
    title: "Excess Stock",
    key: "excessStock",
    width: 140,
    align: "right",
    render: (_, row) => {
      const excess = finiteNumber(row.excessStock);
      const tone = excess === 0 ? "healthy" : stockRiskCategory(row.risk);
      return (
        <strong className={`stock-risk-tone is-${tone}`}>
          {excess !== null && excess > 0 ? "+" : ""}{numberText(excess)}
          {row.unitName ? ` ${row.unitName}` : ""}
        </strong>
      );
    }
  },
  {
    title: "Risk Level",
    key: "risk",
    width: 140,
    render: (_, row) => (
      <span className={`stock-risk-badge is-${stockRiskCategory(row.risk)}`}>
        <span className="stock-risk-dot" aria-hidden="true" />{stockRiskLabel(row.risk)}
      </span>
    )
  },
  {
    title: "Suggested Action",
    key: "action",
    width: 150,
    render: (_, row) => <StockReviewAction row={row} />
  }
];

export default function StockRiskReport({ report, filters, onRefresh }) {
  const [category, setCategory] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const summary = report.summary || {};
  const matchingGroups = groupStockRows(filterStockRows(rows, search));
  const visibleRows = matchingGroups[category];
  const range = stockPageRange(visibleRows.length, page, pageSize);
  let emptyText = "No inventory matches this risk category. Try All Items or adjust the report filters.";
  if (!rows.length) emptyText = "No inventory data is available for the selected report filters.";
  if (search) emptyText = "No SKUs or products match your search.";

  React.useEffect(() => { setPage(1); }, [filters]);

  const changeCategory = key => {
    setCategory(key);
    setPage(1);
  };
  const changeSearch = event => {
    setSearch(event.target.value);
    setPage(1);
  };

  if (report.error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load Stock Risk"
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
    <div className="stock-risk-report">
      <StockRiskCards
        summary={summary}
        threshold={filters.thresholdDays}
        loading={report.loading}
      />
      <p className="stock-risk-data-note">
        Cards show report totals; categories and search cover available product details. Risk levels follow the stock policy.
        {` Total overstock flagged: ${numberText(summary.overstockProducts)}.`}
        {matchingGroups.unavailable.length > 0 && ` ${numberText(matchingGroups.unavailable.length)} matching SKUs have an unavailable risk level.`}
      </p>
      <div className="stock-risk-table-panel">
        <div className="stock-risk-table-toolbar">
          <div className="stock-risk-category-buttons" role="group" aria-label="Stock risk category">
            {stockRiskCategories.map(item => (
              <Button
                key={item.key}
                aria-pressed={category === item.key}
                className={category === item.key ? "is-selected" : ""}
                onClick={() => changeCategory(item.key)}
                disabled={report.loading}
              >
                {item.key !== "all" && <span className={`stock-risk-dot is-${item.key}`} aria-hidden="true" />}
                {item.label}
                <span className={`stock-risk-count is-${item.key}`}>
                  {report.loading ? "—" : numberText(matchingGroups[item.key].length)}
                </span>
              </Button>
            ))}
          </div>
          <Input
            className="stock-risk-search"
            prefix={<Icon type="search" />}
            placeholder="Search SKU, product name…"
            aria-label="Search Stock Risk by SKU or product name"
            allowClear
            value={search}
            onChange={changeSearch}
          />
        </div>
        <Table
          className="purchase-report-table stock-risk-table"
          columns={stockColumns}
          dataSource={visibleRows.slice((range.current - 1) * pageSize, range.current * pageSize)}
          rowKey={(row, index) => `${row.itemId || "item"}-${row.variantId || row.sku || index}`}
          loading={report.loading}
          pagination={false}
          scroll={{ x: 1535 }}
          locale={{ emptyText }}
        />
        <div className="stock-risk-footer">
          <span className="stock-risk-secondary" aria-live="polite">
            {report.loading ? "Loading inventory…" : `Showing ${range.start} to ${range.end} of ${numberText(visibleRows.length)} tracked SKUs`}
          </span>
          <Pagination
            size="small"
            current={range.current}
            pageSize={pageSize}
            total={visibleRows.length}
            onChange={setPage}
            disabled={report.loading}
          />
        </div>
      </div>
    </div>
  );
}
