import React from "react";
import { Alert, Button, Icon, Input, Pagination, Select, Table } from "antd";
import PurchaseSalesCards from "./PurchaseSalesCards";
import { purchaseSalesColumns } from "./PurchaseSalesCells";
import { filterPurchaseSalesRows, purchaseSalesActivities, purchaseSalesPage } from "./purchaseSalesModel";
import { numberText } from "./purchaseSalesFormatters";

export default function PurchaseSalesReport({ report, filters, onRefresh }) {
  const [search, setSearch] = React.useState("");
  const [activity, setActivity] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const rows = Array.isArray(report.rows) ? report.rows : [];
  const summary = report.summary || {};
  const categories = [...new Set([...rows.map(row => row.categoryName), category].filter(Boolean))];
  const visibleRows = filterPurchaseSalesRows(rows, { search, activity, category });
  const activityScope = filterPurchaseSalesRows(rows, { search, activity: "", category });
  const range = purchaseSalesPage(visibleRows.length, page, pageSize);

  React.useEffect(() => { setPage(1); }, [filters]);

  const changeFilter = setter => value => {
    setter(value);
    setPage(1);
  };

  if (report.error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load Purchase vs Sales"
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
    <div className="purchase-sales-report">
      <PurchaseSalesCards summary={summary} loading={report.loading} />
      <p className="purchase-sales-data-note">
        Based on period purchase and sales documents. Quantity movement is a period comparison; inventory decisions require current stock and policy data.
      </p>
      <div className="purchase-sales-table-panel">
        <div className="purchase-sales-table-toolbar">
          <div className="purchase-sales-table-heading">
            <h3>Product comparison</h3>
            <span className="purchase-sales-secondary">{numberText(rows.length)} product details available</span>
          </div>
          <Select
            className="purchase-sales-activity-filter"
            value={activity}
            disabled={report.loading}
            onChange={changeFilter(setActivity)}
            aria-label="Filter by purchase and sales period activity"
          >
            <Select.Option value="">All period activity</Select.Option>
            {purchaseSalesActivities.map(item => (
              <Select.Option key={item.key} value={item.key}>
                {item.label} ({activityScope.filter(row => row.activityStatus === item.key).length})
              </Select.Option>
            ))}
          </Select>
          {categories.length > 0 && (
            <Select
              className="purchase-sales-category-filter"
              value={category}
              disabled={report.loading}
              onChange={changeFilter(setCategory)}
              aria-label="Filter products by category"
            >
              <Select.Option value="">All categories</Select.Option>
              {categories.map(name => <Select.Option key={name} value={name}>{name}</Select.Option>)}
            </Select>
          )}
          <Input
            className="purchase-sales-search"
            aria-label="Search Purchase vs Sales by product or SKU"
            placeholder="Search product, SKU…"
            prefix={<Icon type="search" />}
            allowClear
            value={search}
            onChange={event => changeFilter(setSearch)(event.target.value)}
          />
        </div>
        <Table
          className="purchase-report-table purchase-sales-table"
          columns={purchaseSalesColumns(summary.currencyCode)}
          dataSource={visibleRows.slice((range.current - 1) * pageSize, range.current * pageSize)}
          rowKey={(row, index) => `${row.itemId || "item"}-${row.variantId || row.sku || index}`}
          loading={report.loading}
          pagination={false}
          scroll={{ x: 1390 }}
          locale={{ emptyText: rows.length
            ? "No products match the selected search, activity, and category."
            : "No purchase or sales activity is available for the selected report filters."
          }}
        />
        <div className="purchase-sales-table-footer">
          <div className="purchase-sales-page-summary">
            <span aria-live="polite">
              {report.loading ? "Loading products…" : `Showing ${range.start} to ${range.end} of ${numberText(visibleRows.length)} products`}
            </span>
            <span className="purchase-sales-page-divider" aria-hidden="true" />
            <label htmlFor="purchase-sales-page-size">Rows per page</label>
            <Select
              id="purchase-sales-page-size"
              aria-label="Rows per page"
              value={pageSize}
              onChange={changeFilter(setPageSize)}
              disabled={report.loading}
              size="small"
            >
              {[10, 20, 50].map(size => <Select.Option key={size} value={size}>{size}</Select.Option>)}
            </Select>
          </div>
          <div className="purchase-sales-pagination">
            <Button
              size="small" icon="double-left" aria-label="First page"
              disabled={range.current === 1 || report.loading} onClick={() => setPage(1)}
            />
            <Pagination
              size="small" current={range.current} pageSize={pageSize} total={visibleRows.length}
              onChange={setPage} disabled={report.loading}
            />
            <Button
              size="small" icon="double-right" aria-label="Last page"
              disabled={range.current === range.last || report.loading} onClick={() => setPage(range.last)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
