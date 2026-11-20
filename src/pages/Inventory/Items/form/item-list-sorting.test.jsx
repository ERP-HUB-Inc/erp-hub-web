import ProductList from "./index";
import ProductService from "@services/ItemService";

jest.mock("@layout/datatable", () => {
  const React = require("react");
  return class Datatable extends React.Component {};
}, { virtual: true });
jest.mock("@redux/index", () => ({ Translate: () => null }), { virtual: true });
jest.mock("@router/index", () => ({}), { virtual: true });
jest.mock("@common/util", () => jest.fn().mockImplementation(() => ({ getSetting: () => ({ currency: "$" }) })), { virtual: true });
jest.mock("@enums/index", () => ({}), { virtual: true });
jest.mock("@components/index", () => ({}), { virtual: true });
jest.mock("@components/PageHeader", () => ({}), { virtual: true });
jest.mock("@components/stateless/quantity.value", () => ({ QuantityValue: () => null }), { virtual: true });
jest.mock("@helper/user", () => ({}));
jest.mock("react-ga4", () => ({}));
jest.mock("lucide-react", () => ({}));
jest.mock("../form.create", () => () => null);
jest.mock("../redux/action", () => ({}));
jest.mock("../redux/constant", () => ({}));
jest.mock("@services/ItemService", () => ({ get: jest.fn() }));
jest.mock("@services/LocationService", () => ({}));
jest.mock("@services/ExchangeRateService", () => ({}));
jest.mock("@services/StockIOService", () => ({}));
jest.mock("./edit-stock", () => () => null);
jest.mock("./item-summary", () => () => null);
jest.mock("./item-delete-confirm", () => () => null);
jest.mock("./item-variants", () => ({ __esModule: true, default: () => null, hasItemVariants: () => false }));
jest.mock("./index.css", () => ({}));

const item = (id, name, quantity, price, extra = {}) => ({
  id, name, productVariants: [{ quantity, price }], ...extra
});
const column = (columns, key) => columns.find(entry => entry.key === key);
const orderedIds = (rows, sorter) => [...rows].sort(sorter).map(row => row.id);

let list;
beforeEach(() => {
  jest.clearAllMocks();
  window.history.replaceState({}, "", "/inventories/items?limit=15&current=3&search=Coffee&categoryId=cat&locationId=7&type=1");
  ProductService.get.mockResolvedValue({ data: { data: [], pagination: { total: 45, limit: 15 } } });
  list = new ProductList({ form: { getFieldDecorator: jest.fn(() => input => input) } });
  list.setState = (update, callback) => {
    list.state = { ...list.state, ...(typeof update === "function" ? update(list.state) : update) };
    if (callback) callback();
  };
  list.state.current = 3;
  list.Util = { pushParamsToURL: (path, query) => window.history.replaceState({}, "", `${path}?${query}`) };
});

const flushRequests = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

test.each(["name", "itemType", "incomingStock", "quantity", "price"])("%s uses server sorting with filters and resets offset", async key => {
  expect(column(list.getColumnsForTab("item"), key).sorter).toBe(true);
  list.onTableChange({}, {}, { columnKey: key, order: "ascend" });
  expect(ProductService.get).toHaveBeenLastCalledWith(expect.objectContaining({
    sortField: key, sortOrder: "ASC", offset: 0, limit: 15,
    search: "Coffee", filter: JSON.stringify({ categoryId: "cat" }), locationId: 7, type: 1
  }));
  expect(list.state.current).toBe(1);
  expect(new URLSearchParams(window.location.search).has("current")).toBe(false);
  expect(column(list.getColumnsForTab("item"), key).sortOrder).toBe("ascend");
  list.onTableChange({}, {}, { columnKey: key, order: "descend" });
  expect(ProductService.get.mock.calls[1][0].sortOrder).toBe("DESC");
  await flushRequests();
});

test.each(["out-of-stock", "low-stock-alerts", "margin-review"])("sorting retains the %s filter", async tab => {
  list.state.activeTab = tab;
  list.onTableChange({}, {}, { field: "name", order: "descend" });
  const flag = { "out-of-stock": "outOfStock", "low-stock-alerts": "lowStockAlert", "margin-review": "marginReviewAlert" }[tab];
  expect(ProductService.get.mock.calls[0][0][flag]).toBe(true);
  await flushRequests();
});

test("pagination, page size, and location changes retain the active server sort", async () => {
  list.onTableChange({}, {}, { columnKey: "price", order: "descend" });
  list.onChangePagination(2, 15);
  expect(ProductService.get).toHaveBeenLastCalledWith(expect.objectContaining({ sortField: "price", sortOrder: "DESC", offset: 15 }));
  list.onShowSizeChange(1, 50);
  expect(ProductService.get).toHaveBeenLastCalledWith(expect.objectContaining({ sortField: "price", limit: 50, offset: 0 }));
  list.onChangeLocation(9);
  expect(ProductService.get).toHaveBeenLastCalledWith(expect.objectContaining({ sortField: "price", locationId: 9, offset: 0 }));
  await flushRequests();
});

test("clearing sorting omits both API parameters and clears the header indicator", async () => {
  list.onTableChange({}, {}, { columnKey: "name", order: "ascend" });
  list.onTableChange({}, {}, { columnKey: "name" });
  const request = ProductService.get.mock.calls[1][0];
  expect(request).not.toHaveProperty("sortField");
  expect(request).not.toHaveProperty("sortOrder");
  expect(request.offset).toBe(0);
  expect(column(list.getColumnsForTab("item"), "name").sortOrder).toBeNull();
  await flushRequests();
});

test("stock tab uses server sorting for name and stock, local sorting for adjustments", async () => {
  list.state.activeTab = "stock";
  expect(column(list.getColumnsForTab("stock"), "name").sorter).toBe(true);
  expect(column(list.getColumnsForTab("stock"), "quantity").sorter).toBe(true);
  list.onTableChange({}, {}, { columnKey: "quantity", order: "ascend" });
  const rows = [item("a", "A", 1), item("b", "B", 5)];
  list.state.stockInItems = { a: { qtyIn: "10.5" }, b: { qtyIn: -2 } };
  list.onTableChange({}, {}, { columnKey: "qtyIn", order: "ascend" });
  expect(orderedIds(rows, column(list.getColumnsForTab("stock"), "qtyIn").sorter)).toEqual(["b", "a"]);
  list.onTableChange({}, {}, { columnKey: "reorderPoint", order: "descend" });
  expect(ProductService.get).toHaveBeenCalledTimes(1);
  expect(column(list.getColumnsForTab("stock"), "quantity").sortOrder).toBeNull();
  expect(column(list.getColumnsForTab("stock"), "reorderPoint").sortOrder).toBe("descend");
  list.onChangePagination(2, 15);
  const request = ProductService.get.mock.calls[1][0];
  expect(request.sortField).toBe("quantity");
  expect(request.sortOrder).toBe("ASC");
  await flushRequests();
});

test("switching tabs resets sorting and never sends local or unsupported sort fields", async () => {
  list.onTableChange({}, {}, { columnKey: "price", order: "descend" });
  list.onChangeTab("stock");
  expect(ProductService.get.mock.calls[1][0]).not.toHaveProperty("sortField");
  expect(list.state.tableSort).toBeNull();
  list.onTableChange({}, {}, { columnKey: "unsupported", order: "ascend" });
  expect(ProductService.get).toHaveBeenCalledTimes(2);
  await flushRequests();
});

test("a late response from an earlier sort cannot replace the latest server order", async () => {
  let resolveEarlier;
  ProductService.get.mockImplementationOnce(() => new Promise(resolve => { resolveEarlier = resolve; }));
  const latestRows = [item("latest", "Latest", 1)];
  ProductService.get.mockResolvedValueOnce({ data: { data: latestRows, pagination: { total: 1, limit: 15 } } });
  list.onTableChange({}, {}, { columnKey: "name", order: "ascend" });
  list.onTableChange({}, {}, { columnKey: "name", order: "descend" });
  await flushRequests();
  resolveEarlier({ data: { data: [item("old", "Old", 1)], pagination: { total: 1, limit: 15 } } });
  await flushRequests();
  expect(list.state.products).toEqual(latestRows);
  expect(list.state.loading).toBe(false);
});

test("a failed sort displays the existing error and retry retains its sort parameters", async () => {
  ProductService.get.mockRejectedValueOnce(new Error("Request failed"));
  list.onTableChange({}, {}, { columnKey: "price", order: "descend" });
  await flushRequests();
  expect(list.state.listError).toContain("Unable to load items");
  expect(list.state.loading).toBe(false);
  list.fetchList(true);
  expect(ProductService.get).toHaveBeenLastCalledWith(expect.objectContaining({ sortField: "price", sortOrder: "DESC" }));
  await flushRequests();
  expect(list.state.listError).toBe("");
});

test("effected stock sorts and renders the current quantity plus the latest adjustment", () => {
  const rows = [item("a", "A", 1), item("b", "B", 5)];
  const adjustedColumn = column(list.stockColumns, "reorderPoint");
  expect(orderedIds(rows, adjustedColumn.sorter)).toEqual(["a", "b"]);
  list.state.stockInItems = { a: { qtyIn: "10.5" } };
  expect(orderedIds(rows, adjustedColumn.sorter)).toEqual(["b", "a"]);
  expect(adjustedColumn.render(null, rows[0]).props.quantity).toBe(11.5);
});

test("Qty IN form fields stay attached to item IDs when row positions change", () => {
  const render = column(list.stockColumns, "qtyIn").render;
  const a = item("item-a", "A", 1), b = item("item-b", "B", 5);
  render(null, a, 0);
  render(null, b, 1);
  render(null, b, 0);
  render(null, a, 1);
  expect(list.props.form.getFieldDecorator.mock.calls.map(([name]) => name)).toEqual([
    "qtyIn_item-a", "qtyIn_item-b", "qtyIn_item-b", "qtyIn_item-a"
  ]);
  list.state.stockInItems = { "item-a": { qtyIn: 12 } };
  render(null, a, 0);
  expect(list.props.form.getFieldDecorator).toHaveBeenLastCalledWith("qtyIn_item-a", { initialValue: 12 });
});
