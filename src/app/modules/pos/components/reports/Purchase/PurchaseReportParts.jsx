import React from "react";
import {
  Button,
  Card,
  DatePicker,
  Icon,
  Input,
  Pagination,
  Skeleton,
  Table
} from "antd";
import moment from "moment";
import { SelectLocation, SelectVendor } from "../../../../../../components/stateful";
import { pageSize, stats } from "./purchaseReportConfig";
import CostVarianceFilter from "./CostVarianceFilter";
import StockCoverageFilter from "./StockCoverageFilter";

const { RangePicker } = DatePicker;
const filterToolbarClasses = {
  priceIncrease: "cost-filter-toolbar",
  overstock: "stock-risk-filter-toolbar",
  purchaseVsSales: "purchase-sales-filter-toolbar"
};
const refreshLabels = {
  priceIncrease: "Recalculate",
  overstock: "Recalculate Run-Rate",
  purchaseVsSales: "Recalculate"
};

export function SummaryCards({ summary }) {
  return (
    <section className="purchase-overview-summary" aria-label="Purchase summary" aria-busy={summary.loading}>
      {stats.map(item => (
        <Card
          key={item.key}
          className="stock-risk-card purchase-overview-summary-card"
          aria-label={item.title}
        >
          <Skeleton active loading={summary.loading} title={false} paragraph={{ rows: 3 }}>
            <div className="stock-risk-card-heading">
              <span>{item.title}</span>
              <span className="stock-risk-icon-tile" aria-hidden="true">
                <Icon type={item.icon} />
              </span>
            </div>
            <div className="stock-risk-card-value">
              <strong>{item.format(summary.data[item.key])}</strong>
            </div>
            <div className="stock-risk-card-detail">For selected report filters</div>
          </Skeleton>
        </Card>
      ))}
    </section>
  );
}

export function ReportFilters({ activeTab, filters, loading, onChange, onRefresh }) {
  const showLocation = activeTab !== "trend";
  const showSupplier = showLocation && activeTab !== "suppliers";
  const toolbarClass = filterToolbarClasses[activeTab] || "";
  const enhancedFilters = Boolean(toolbarClass);

  const onDateChange = dates => {
    if (!dates || !dates[0] || !dates[1]) return;
    onChange({
      fromDate: dates[0].format("YYYY-MM-DD"),
      toDate: dates[1].format("YYYY-MM-DD")
    });
  };

  return (
    <div className={`purchase-report-filter-bar ${toolbarClass}`}>
      <RangePicker
        aria-label="Purchase date range"
        allowClear={false}
        format="DD/MM/YYYY"
        value={[moment(filters.fromDate), moment(filters.toDate)]}
        onChange={onDateChange}
      />

      {showLocation && (
        <SelectLocation
          aria-label="Store"
          suffixIcon={enhancedFilters ? <Icon type="shop" /> : undefined}
          className="purchase-report-store-filter"
          size="default"
          style={{ width: undefined, margin: 0 }}
          width={190}
          allValue=""
          allLabel="All stores"
          value={filters.locationId}
          onChange={locationId => onChange({ locationId: locationId == null ? "" : String(locationId) })}
        />
      )}

      {showSupplier && (
        <SelectVendor
          aria-label="Supplier"
          suffixIcon={enhancedFilters ? <Icon type="team" /> : undefined}
          className="purchase-report-supplier-filter"
          size="default"
          style={{ width: undefined, margin: 0 }}
          width={200}
          allValue=""
          allLabel="All suppliers"
          value={filters.supplierId}
          onChange={supplierId => onChange({ supplierId: supplierId == null ? "" : String(supplierId) })}
        />
      )}

      {activeTab === "priceIncrease" && (
        <CostVarianceFilter
          value={filters.minChangePercent}
          onChange={minChangePercent => onChange({ minChangePercent })}
        />
      )}

      {activeTab === "overstock" && (
        <StockCoverageFilter
          value={filters.thresholdDays}
          onChange={thresholdDays => onChange({ thresholdDays })}
        />
      )}

      <Button
        className="purchase-report-refresh-button"
        onClick={onRefresh}
        loading={loading}
        disabled={loading}
      >
        <Icon type="reload" /> {refreshLabels[activeTab] || "Refresh"}
      </Button>
    </div>
  );
}

const formatPeriod = period => {
  if (!period || !period.fromDate || !period.toDate) return "-";
  if (period.fromDate === period.toDate) return moment(period.fromDate).format("MMM D, YYYY");
  return `${moment(period.fromDate).format("MMM D, YYYY")} – ${moment(period.toDate).format("MMM D, YYYY")}`;
};

export function CostComparisonReference({ period, loading }) {
  let text = "Comparison period unavailable";
  if (loading) text = "Loading comparison…";
  else if (period) text = `Ref: ${formatPeriod(period.current)} vs ${formatPeriod(period.previous)}`;

  return <span className="cost-comparison-reference">{text}</span>;
}

const reportRowKey = (record, index) => {
  if (record.variantId) return `item-${record.itemId || record.productId || ""}-variant-${record.variantId}`;
  if (record.itemId) return `item-${record.itemId}`;
  if (record.productVariantId) return `variant-${record.productVariantId}`;
  if (record.productId) return `product-${record.productId}`;
  if (record.supplierId) return `supplier-${record.supplierId}`;
  return record.period || index;
};

export function ReportTable({ section, report, filters, page, loading, onPageChange }) {
  const [search, setSearch] = React.useState("");
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const columns = section.columns.map((column, index) => {
    if (index === 0) return {
      ...column,
      render: (value, row) => (
        <div className="purchase-overview-identity">
          <span className="purchase-overview-identity-icon" aria-hidden="true"><Icon type={section.icon} /></span>
          <strong>{column.render ? column.render(value, row) : value}</strong>
        </div>
      )
    };
    if (column.key === "sku") return {
      ...column,
      render: value => <span className="purchase-overview-sku">{value || "No SKU"}</span>
    };
    return column;
  });
  const scrollWidth = columns.reduce((total, column) => total + column.width, 0);
  const searchFields = section.searchFields || [];
  const query = search.trim().toLowerCase();
  const visibleRows = query ? rows.filter(row => searchFields.some(field =>
    String(row[field] == null ? "" : row[field]).toLowerCase().includes(query)
  )) : rows;
  const lastPage = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const current = Math.min(page, lastPage);
  const start = visibleRows.length ? (section.paged ? (current - 1) * pageSize : 0) + 1 : 0;
  const end = section.paged ? Math.min(current * pageSize, visibleRows.length) : visibleRows.length;
  const pageRows = section.paged ? visibleRows.slice((current - 1) * pageSize, current * pageSize) : visibleRows;

  React.useEffect(() => { setSearch(""); }, [filters]);

  return (
    <div className="purchase-overview-table-panel">
      <div className="purchase-overview-table-toolbar">
        <div>
          <h3>{section.tableTitle}</h3>
          <span className="purchase-overview-secondary">
            {rows.length.toLocaleString()} {section.rowLabel} available
          </span>
        </div>
        <Input
          className="purchase-overview-search"
          prefix={<Icon type="search" />}
          placeholder={section.searchPlaceholder}
          aria-label={section.searchPlaceholder}
          allowClear
          value={search}
          onChange={event => {
            setSearch(event.target.value);
            onPageChange(1);
          }}
        />
      </div>
      <Table
        className="purchase-report-table purchase-overview-table"
        scroll={{ x: scrollWidth }}
        rowKey={reportRowKey}
        loading={loading}
        dataSource={pageRows}
        columns={columns}
        pagination={false}
        locale={{ emptyText: rows.length
          ? "No records match your search. Try another name or reference."
          : "No purchase data is available for the selected report filters."
        }}
      />
      <div className="purchase-overview-table-footer">
        <span className="purchase-overview-secondary" aria-live="polite">
          {loading ? "Loading report…" : `Showing ${start} to ${end} of ${visibleRows.length.toLocaleString()} ${section.rowLabel}`}
        </span>
        {section.paged && (
          <Pagination
            size="small"
            current={current}
            pageSize={pageSize}
            total={visibleRows.length}
            disabled={loading}
            onChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
