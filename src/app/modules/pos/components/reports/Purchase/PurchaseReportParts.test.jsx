import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { ReportTable, ReportFilters, SummaryCards } from "./PurchaseReportParts";
import { sections } from "./purchaseReportConfig";

jest.mock("../../../../common/util", () => jest.fn().mockImplementation(() => ({ formatCurrency: value => String(value) })));
jest.mock("../../../services/report/PurchaseService", () => ({}));
jest.mock("../../../../../../components/stateful", () => {
  const React = require("react");
  return {
    SelectLocation: props => <button aria-label="Store" onClick={() => props.onChange(undefined)}>Store</button>,
    SelectVendor: props => <button aria-label="Supplier" onClick={() => props.onChange(99)}>Supplier</button>
  };
});
jest.mock("antd", () => {
  const React = require("react");
  const Input = ({ onChange, value, ...props }) => <input aria-label={props["aria-label"]} value={value} onChange={onChange} />;
  const Select = ({ children }) => <div>{children}</div>;
  Select.Option = ({ children }) => <span>{children}</span>;
  return {
    Input, Select,
    Card: ({ children, loading, ...props }) => <article aria-label={props["aria-label"]}>{loading ? <span>Loading summary…</span> : children}</article>,
    Skeleton: ({ loading, children }) => loading ? <span>Loading summary…</span> : children,
    Icon: () => null,
    Button: ({ children, onClick, disabled }) => <button onClick={onClick} disabled={disabled}>{children}</button>,
    DatePicker: { RangePicker: () => <input aria-label="Purchase date range" /> },
    Table: ({ dataSource, columns, rowKey, locale }) => <table><tbody>
      {dataSource.length ? dataSource.map((row, index) => <tr key={rowKey(row, index)}>{columns.map(column => <td key={column.key}>{column.render(row[column.dataIndex], row)}</td>)}</tr>) : <tr><td>{locale.emptyText}</td></tr>}
    </tbody></table>,
    Pagination: ({ current, onChange, disabled }) => <button aria-label="Next page" disabled={disabled} onClick={() => onChange(current + 1)}>Page {current}</button>
  };
});

let container;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});
const rows = Array.from({ length: 25 }, (_, index) => ({ itemId: index + 1, itemName: `Item ${index + 1}`, sku: `SKU-${index + 1}` }));
const renderTable = (props = {}) => act(() => { ReactDOM.render(
  <ReportTable section={sections.products} report={{ rows }} page={1} onPageChange={() => {}} {...props} />, container
); });

test("paginates loaded rows once and clamps the range when results shrink", () => {
  renderTable({ page: 2 });
  expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
  expect(container.textContent).toContain("Showing 21 to 25 of 25 items");
  renderTable({ page: 2, report: { rows: rows.slice(0, 2) } });
  expect(container.textContent).toContain("Showing 1 to 2 of 2 items");
});

test("searches product names and SKU, resets paging, and distinguishes no matches", () => {
  const onPageChange = jest.fn();
  renderTable({ onPageChange });
  act(() => Simulate.change(container.querySelector("input"), { target: { value: "SKU-25" } }));
  expect(onPageChange).toHaveBeenCalledWith(1);
  expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
  expect(container.textContent).toContain("Item 25");
  expect(container.textContent).toContain("Showing 1 to 1 of 1 items");
  act(() => Simulate.change(container.querySelector("input"), { target: { value: "missing" } }));
  expect(container.textContent).toContain("No records match your search");
  expect(container.textContent).toContain("Showing 0 to 0 of 0 items");
});

test("trend remains unpaged and filters search periods", () => {
  renderTable({ section: sections.trend, report: { rows: [{ period: "2026-10" }, { period: "2026-09" }] } });
  expect(container.querySelector("[aria-label='Next page']")).toBeNull();
  act(() => Simulate.change(container.querySelector("input"), { target: { value: "2026-10" } }));
  expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
});

test("empty data has a report-filter message and loading has its own announcement", () => {
  renderTable({ report: { rows: [] } });
  expect(container.textContent).toContain("No purchase data is available");
  renderTable({ report: { rows: [] }, loading: true });
  expect(container.textContent).toContain("Loading report…");
});

test("shared filters preserve scope and normalize clear/selected IDs", () => {
  const onChange = jest.fn();
  const filters = { fromDate: "2026-10-01", toDate: "2026-10-31", locationId: "", supplierId: "" };
  const render = activeTab => act(() => { ReactDOM.render(<ReportFilters activeTab={activeTab} filters={filters} onChange={onChange} />, container); });
  render("trend");
  expect(container.querySelector("[aria-label='Store']")).toBeNull();
  render("suppliers");
  expect(container.querySelector("[aria-label='Supplier']")).toBeNull();
  act(() => Simulate.click(container.querySelector("[aria-label='Store']")));
  expect(onChange).toHaveBeenCalledWith({ locationId: "" });
  render("products");
  act(() => Simulate.click(container.querySelector("[aria-label='Supplier']")));
  expect(onChange).toHaveBeenCalledWith({ supplierId: "99" });
});


test("summary cards retain all six metrics, zero values, and unavailable placeholders", () => {
  act(() => {
    ReactDOM.render(<SummaryCards summary={{ loading: false, data: {
      totalOrders: 0,
      totalPurchase: 1234567890,
      totalQuantity: 12,
      totalItems: 3,
      totalShippingFee: 0,
      totalDiscount: null
    } }} />, container);
  });
  expect(container.querySelectorAll("article")).toHaveLength(6);
  expect(container.querySelector("[aria-label='Orders']").textContent).toContain("0");
  expect(container.querySelector("[aria-label='Purchase Amount']").textContent).toContain("1234567890");
  expect(container.querySelector("[aria-label='Quantity']").textContent).toContain("12");
  expect(container.querySelector("[aria-label='Items']").textContent).toContain("3");
  expect(container.querySelector("[aria-label='Shipping Fee']").textContent).toContain("0");
  expect(container.querySelector("[aria-label='Discount']").textContent).toContain("-");
  expect(container.querySelector("[aria-label='Purchase summary']").getAttribute("aria-busy")).toBe("false");
});

test("summary loading hides stale figures and announces the busy state", () => {
  act(() => {
    ReactDOM.render(<SummaryCards summary={{ loading: true, data: { totalPurchase: 987654 } }} />, container);
  });
  expect(container.querySelector("[aria-label='Purchase summary']").getAttribute("aria-busy")).toBe("true");
  expect(container.querySelectorAll("article")).toHaveLength(6);
  expect(container.textContent).not.toContain("987654");
  expect(container.textContent).toContain("Loading summary…");
});
