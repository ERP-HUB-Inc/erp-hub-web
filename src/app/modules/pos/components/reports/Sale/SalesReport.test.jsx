import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import SalesReport from "./SalesReport";
import ReportSaleService from "../../../services/report/SaleService";
import PrivilegeService from "../../../services/settings/PrivilegeService";

jest.mock("../../../../common/util", () => jest.fn().mockImplementation(() => ({ formatCurrency: value => `$${Number(value).toFixed(2)}` })));
jest.mock("../../../../common/router/history", () => ({ push: jest.fn() }));
jest.mock("../../../../common/components/shares/List/NoPermissionV2", () => () => <p>No permission</p>);
jest.mock("@services/LocationService", () => ({ get: jest.fn(() => Promise.resolve({ data: { data: [] } })) }));
jest.mock("../../../services/settings/PrivilegeService", () => ({ checkPermission: jest.fn() }));
jest.mock("../../../services/report/SaleService", () => ({
  getSalesSummary: jest.fn(), getSalesTrend: jest.fn(), getSalesProducts: jest.fn(), getSalesPerformance: jest.fn()
}));
jest.mock("antd", () => {
  const React = require("react");
  const Container = ({ children }) => <div>{children}</div>;
  const Select = Container;
  Select.Option = Container;
  const Tabs = Container;
  Tabs.TabPane = Container;
  return {
    Alert: ({ message }) => <p role="alert">{message}</p>,
    Button: ({ children }) => <button>{children}</button>,
    Card: Container, Col: Container, Row: Container, Select, Tabs,
    DatePicker: { RangePicker: () => null }, Input: { Search: () => null },
    Icon: () => null, PageHeader: () => null, Progress: () => null,
    Statistic: ({ title, value }) => <div aria-label={title}>{value}</div>,
    Table: ({ columns, dataSource }) => <table>
      <thead><tr>{columns.map(column => <th key={column.key}>{column.title}</th>)}</tr></thead>
      <tbody>{dataSource.map((row, index) => <tr key={index}>{columns.map(column => <td key={column.key}>
        {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]}
      </td>)}</tr>)}</tbody>
    </table>
  };
});

let container;
beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  PrivilegeService.checkPermission.mockResolvedValue({ data: true });
  ReportSaleService.getSalesPerformance.mockResolvedValue({ data: {} });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test.each([
  [12.5, "$12.50"],
  [0, "$0.00"],
  [null, "-"],
  [undefined, "-"]
])("shows API discounts in the summary, trend, and item table: %p", async (discount, expected) => {
  ReportSaleService.getSalesSummary.mockResolvedValue({ data: { discount } });
  ReportSaleService.getSalesTrend.mockResolvedValue({ data: [{ period: "2026-10", salesRevenue: 100, discount }] });
  ReportSaleService.getSalesProducts.mockResolvedValue({ data: { data: [{ itemName: "Item", salesRevenue: 100, discount }] } });

  await act(async () => { ReactDOM.render(<SalesReport />, container); });

  expect(container.querySelector('[aria-label="Discount"]').textContent).toBe(expected);
  const tables = Array.from(container.querySelectorAll("table"));
  expect(tables).toHaveLength(2);
  tables.forEach(table => {
    const headers = Array.from(table.querySelectorAll("th")).map(header => header.textContent);
    const cells = table.querySelectorAll("tbody tr:first-child td");
    expect(cells[headers.indexOf("Discount")].textContent).toBe(expected);
    const revenueIndex = headers.findIndex(header => header.includes("Revenue"));
    expect(cells[revenueIndex].textContent).toBe("$100.00");
  });
});

test("does not fetch or display report values without permission", async () => {
  PrivilegeService.checkPermission.mockResolvedValue({ data: false });
  await act(async () => { ReactDOM.render(<SalesReport />, container); });
  expect(container.textContent).toBe("No permission");
  expect(ReportSaleService.getSalesSummary).not.toHaveBeenCalled();
  expect(ReportSaleService.getSalesTrend).not.toHaveBeenCalled();
  expect(ReportSaleService.getSalesProducts).not.toHaveBeenCalled();
});
