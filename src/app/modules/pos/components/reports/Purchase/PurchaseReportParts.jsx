import React from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Icon,
  Row,
  Select,
  Statistic,
  Table
} from "antd";
import moment from "moment";
import { activityStats, pageSize, quantity, stats } from "./purchaseReportConfig";
import CostVarianceFilter from "./CostVarianceFilter";
import StockCoverageFilter from "./StockCoverageFilter";

const { RangePicker } = DatePicker;
const { Option } = Select;
const filterToolbarClasses = { priceIncrease: "cost-filter-toolbar", overstock: "stock-risk-filter-toolbar" };
const refreshLabels = { priceIncrease: "Recalculate", overstock: "Recalculate Run-Rate" };

export function SummaryCards({ summary }) {
  return (
    <Row gutter={16}>
      {stats.map(item => (
        <Col
          key={item.key}
          xs={24}
          sm={12}
          md={8}
          lg={4}
          className="product-report-stat-col"
        >
          <Card
            loading={summary.loading}
            className={`product-report-stat-card ${item.color}`}
            bodyStyle={{ padding: 20 }}
          >
            <div className="product-report-stat-content">
              <span className={`product-report-stat-icon ${item.color}`}>
                <Icon type={item.icon} />
              </span>
              <Statistic
                title={item.title}
                value={item.format(summary.data[item.key])}
                className="product-report-statistic"
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export function ReportFilters({ activeTab, filters, locations, suppliers, loading, onChange, onRefresh }) {
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
        <Select
          aria-label="Store"
          suffixIcon={enhancedFilters ? <Icon type="shop" /> : undefined}
          className="purchase-report-store-filter"
          value={filters.locationId}
          onChange={locationId => onChange({ locationId })}
        >
          {[{ id: "", name: "All stores" }, ...locations].map(location => (
            <Option key={location.id} value={location.id}>{location.name}</Option>
          ))}
        </Select>
      )}

      {showSupplier && (
        <Select
          aria-label="Supplier"
          suffixIcon={enhancedFilters ? <Icon type="team" /> : undefined}
          className="purchase-report-supplier-filter"
          value={filters.supplierId}
          onChange={supplierId => onChange({ supplierId })}
        >
          {[{ id: "", name: "All suppliers" }, ...suppliers].map(supplier => (
            <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
          ))}
        </Select>
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

export function ActivitySummary({ summary }) {
  return (
    <Row gutter={16} className="purchase-report-activity">
      {activityStats.map(item => (
        <Col key={item.key} xs={12} sm={8} md={4}>
          <Statistic
            title={item.title}
            value={(item.format || quantity)(summary[item.key])}
          />
        </Col>
      ))}
    </Row>
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
  if (record.variantId) return `variant-${record.variantId}`;
  if (record.itemId) return `item-${record.itemId}`;
  if (record.productVariantId) return `variant-${record.productVariantId}`;
  if (record.productId) return `product-${record.productId}`;
  if (record.supplierId) return `supplier-${record.supplierId}`;
  return record.period || index;
};

export function ReportTable({ section, report, page, loading, onPageChange }) {
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const pagination = section.paged ? {
    current: page,
    pageSize,
    total: rows.length,
    showTotal: total => `Total ${total} items`,
    onChange: onPageChange
  } : false;

  return (
    <Table
      className="purchase-report-table"
      size="small"
      scroll={{ x: 920 }}
      rowKey={reportRowKey}
      loading={loading}
      dataSource={rows}
      columns={section.columns}
      pagination={pagination}
    />
  );
}

