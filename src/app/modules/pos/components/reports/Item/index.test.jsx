import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { Table, Input, Select, Alert } from "antd";
import ReportProduct from "./index";
import PricingManagement from "../../../containers/reports/Pricing";
import ProductService from "../../../services/report/ProductService";
import ItemService from "@services/ItemService";
import BrandService from "@services/BrandService";

jest.mock("antd", () => {
  const React = require("react");
  const wrapper = ({ children }) => React.createElement("div", null, children);
  return {
    Statistic: () => null, PageHeader: () => null,
    Table: jest.fn(({ columns, dataSource }) => React.createElement("table", null,
      React.createElement("tbody", null, dataSource.map((row, index) => React.createElement("tr", { key: row.productVariantId || row.id || index },
        columns.map(column => React.createElement("td", { key: column.key }, column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex]))))))),
    Select: Object.assign(jest.fn(() => null), { Option: () => null }),
    Card: wrapper, Row: wrapper, Col: wrapper,
    Input: { Search: jest.fn(() => null) },
    InputNumber: ({ onChange, ...props }) => React.createElement("input", {
      type: "number", value: props.value == null ? "" : props.value, disabled: props.disabled,
      "aria-label": props["aria-label"], "aria-invalid": props["aria-invalid"],
      onChange: event => onChange(event.target.value === "" ? null : Number(event.target.value))
    }),
    Button: ({ children, onClick, disabled, ...props }) => React.createElement("button", { onClick, disabled, "aria-label": props["aria-label"] }, children), Drawer: () => null,
    Icon: () => null, Tag: wrapper, Tabs: Object.assign(wrapper, { TabPane: () => null }),
    Alert: jest.fn(() => null), message: { success: jest.fn(), warning: jest.fn() }
  };
});
jest.mock("react-localize-redux", () => ({ Translate: () => null }));
jest.mock("../../../../common/router/history", () => ({ push: ({ pathname, search }) => global.window.history.pushState({}, "", pathname + search) }));
jest.mock("../../../../common/util", () => jest.fn().mockImplementation(() => ({ formatCurrency: value => `$${value}` })));
jest.mock("../../../services/report/ProductService", () => ({ getInventoryStockReport: jest.fn() }));
jest.mock("@services/ItemService", () => ({ updateSellingPrice: jest.fn(), updateSellingPricesBatch: jest.fn(), editProductCost: jest.fn() }));
jest.mock("@services/LocationService", () => ({ get: () => Promise.resolve({ data: { data: [] } }) }));
jest.mock("@services/CategoryService", () => ({ get: () => Promise.resolve({ data: { data: [] } }) }));
jest.mock("@services/BrandService", () => ({ get: jest.fn(() => Promise.resolve({ data: { data: [] } })) }));
jest.mock("./index.css", () => ({}));

let container;
const lastProps = component => component.mock.calls[component.mock.calls.length - 1][0];
const response = (items = [], page = 1, limit = 15) => ({ data: { items, summary: {}, pagination: { total: 100, page, limit } } });
const settle = async callback => {
  await act(async () => {
    if (callback) callback();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};
const mount = () => settle(() => ReactDOM.render(<ReportProduct />, container));
const changeTable = (key, order, current = 3, pageSize = 15) => settle(() => lastProps(Table).onChange(
  { current, pageSize }, {}, key ? { columnKey: key, field: key, order } : {}
));

beforeEach(() => {
  jest.clearAllMocks();
  ItemService.updateSellingPricesBatch.mockReset();
  ItemService.editProductCost.mockReset();
  window.history.replaceState({}, "", "/reports/product?page=3&limit=15&keyword=Coffee&locationId=7&categoryId=cat&brandId=brand&status=HEALTHY");
  ProductService.getInventoryStockReport.mockImplementation(params => Promise.resolve(response([], params.page, params.limit)));
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.useRealTimers();
});

test.each(["itemName", "sku", "unitCost", "salesPrice", "marketPrice", "marginPercent", "quantityOnHand"])("%s sorts through the backend in both directions and preserves filters", async key => {
  await mount();
  expect(lastProps(Table).columns.find(column => column.key === key).sorter).toBe(true);
  await changeTable(key, "ascend");
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({
    sortBy: key, sortOrder: "ASC", page: 1, limit: 15,
    keyword: "Coffee", locationId: "7", categoryId: "cat", brandId: "brand", status: "HEALTHY"
  }));
  expect(lastProps(Table).columns.find(column => column.key === key).sortOrder).toBe("ascend");
  await changeTable(key, "descend");
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: key, sortOrder: "DESC", page: 1 }));
});

test("pagination keeps sorting; clearing it resets the page and removes sorting from the request and URL", async () => {
  await mount();
  await changeTable("unitCost", "ascend");
  await changeTable("unitCost", "ascend", 4);
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 4, sortBy: "unitCost", sortOrder: "ASC" }));
  await changeTable("unitCost", undefined, 4);
  const params = ProductService.getInventoryStockReport.mock.calls.slice(-1)[0][0];
  expect(params.page).toBe(1);
  expect(params).not.toHaveProperty("sortBy");
  expect(params).not.toHaveProperty("sortOrder");
  expect(new URLSearchParams(window.location.search).has("sortBy")).toBe(false);
  expect(lastProps(Table).columns.find(column => column.key === "unitCost").sortOrder).toBeNull();
});

test("location and page size changes retain sorting and reset the page", async () => {
  await mount();
  await changeTable("quantityOnHand", "descend");
  await changeTable("quantityOnHand", "descend", 3, 50);
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, limit: 50, sortBy: "quantityOnHand" }));
  const location = Select.mock.calls.slice().reverse().find(([props]) => props.name === "locationId")[0];
  await settle(() => location.onChange(9));
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, locationId: 9, sortBy: "quantityOnHand", sortOrder: "DESC" }));
});

test("sorting while a search is pending uses the latest keyword and cancels the old search timer", async () => {
  jest.useFakeTimers();
  await mount();
  act(() => lastProps(Input.Search).onChange({ target: { value: "Tea & Coffee" } }));
  await changeTable("salesPrice", "descend");
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: "Tea & Coffee", sortBy: "salesPrice", sortOrder: "DESC" }));
  await settle(() => jest.advanceTimersByTime(500));
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(2);
});

test("late responses cannot overwrite the latest backend order", async () => {
  await mount();
  let resolveOld;
  ProductService.getInventoryStockReport.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
  await changeTable("itemName", "ascend");
  const rows = [{ id: "z", productName: "Z" }, { id: "a", productName: "A" }];
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response(rows));
  await changeTable("itemName", "descend");
  await settle(() => resolveOld(response([{ id: "old" }], 3)));
  expect(lastProps(Table).dataSource).toEqual(rows);
  expect(lastProps(Table).pagination.current).toBe(1);
});

test("failed sorting shows an error and retry retains filters and sorting", async () => {
  await mount();
  ProductService.getInventoryStockReport.mockRejectedValueOnce(new Error("Unavailable"));
  await changeTable("sku", "ascend");
  expect(lastProps(Alert).message).toContain("Unable to load");
  expect(lastProps(Table).loading).toBe(false);
  await settle(() => lastProps(Alert).description.props.onClick());
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: "sku", sortOrder: "ASC", keyword: "Coffee" }));
});

test("restores valid URL sorting and disables unsupported stock age sorting", async () => {
  window.history.replaceState({}, "", "/reports/product?sortBy=marginPercent&sortOrder=desc&page=2&limit=15");
  await mount();
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: "marginPercent", sortOrder: "DESC", page: 2 }));
  expect(lastProps(Table).columns.find(column => column.key === "stockAge").sorter).toBeUndefined();
});

test("ignores unsupported sorting supplied in the URL", async () => {
  window.history.replaceState({}, "", "/reports/product?sortBy=stockAge&sortOrder=ASC");
  await mount();
  expect(ProductService.getInventoryStockReport.mock.calls[0][0]).not.toHaveProperty("sortBy");
  expect(ProductService.getInventoryStockReport.mock.calls[0][0]).not.toHaveProperty("sortOrder");
});

const pricingRows = [
  { productId: "product", productVariantId: "variant-a", itemName: "Item A", productName: "Item", variantName: "A", unitCost: 80, salesPrice: 90, marginPercent: 11.11 },
  { productId: "product", productVariantId: "variant-b", itemName: "Item B", productName: "Item", variantName: "B", unitCost: 40, salesPrice: 50, marginPercent: 20 }
];
const mountPricing = async (rows = pricingRows) => {
  ProductService.getInventoryStockReport.mockImplementation(params => Promise.resolve(response(rows, params.page, params.limit)));
  await settle(() => ReactDOM.render(<PricingManagement />, container));
};
const editMargin = value => act(() => {
  Simulate.change(container.querySelector('input[aria-label="Margin percentage for Item A"]'), { target: { value } });
});

test("pricing page previews the gross-margin price for one variant without sending a save request", async () => {
  await mountPricing();
  expect(lastProps(Table).columns.some(column => column.key === "stockAge")).toBe(false);
  const columnKeys = lastProps(Table).columns.map(column => column.key);
  expect(columnKeys).not.toContain("marketPrice");
  expect(columnKeys.indexOf("expectedProfit")).toBe(columnKeys.indexOf("quantityOnHand") + 1);
  expect(columnKeys.indexOf("marginPercent")).toBe(columnKeys.indexOf("unitCost") + 1);
  expect(Alert).not.toHaveBeenCalled();
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).toBeNull();
  editMargin("20");
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(false);
  expect(container.querySelector('button[aria-label="Save price for Item B"]')).toBeNull();
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("100.00");
  expect(container.querySelector(".pricing-price-preview").textContent).toContain("Current: 90.00");
  expect(container.querySelectorAll(".pricing-price-preview")).toHaveLength(1);
  expect(container.querySelector('input[aria-label="Margin percentage for Item B"]').value).toBe("20");
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(1);
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
  act(() => { Simulate.click(container.querySelector('button[aria-label="Reset margin for Item A"]')); });
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).toBeNull();
});

test("invalid margins show errors and never display an invalid unit price", async () => {
  await mountPricing();
  editMargin("100");
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('[role="alert"]').textContent).toContain("less than 100%");
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
  editMargin("");
  expect(container.querySelector('[role="alert"]').textContent).toContain("valid margin");
  editMargin("-25");
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("64.00");
});

test("pricing previews survive server sorting and filters without changing the report route", async () => {
  await mountPricing();
  editMargin("20");
  await changeTable("salesPrice", "ascend");
  expect(window.location.pathname).toBe("/inventories/pricing-management");
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("100.00");
  expect(lastProps(Table).dataSource[0].salesPrice).toBe(90);
  expect(Array.from(container.querySelectorAll("button")).some(button => button.textContent === "Reset all previews")).toBe(false);
});

test("pricing cannot edit rows with no unit cost or no variant identifier", async () => {
  await mountPricing([
    { ...pricingRows[0], unitCost: 0 },
    { ...pricingRows[1], productVariantId: undefined }
  ]);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').disabled).toBe(false);
  expect(container.querySelector('input[aria-label="Selling price for Item B"]').disabled).toBe(true);
  expect(container.textContent).toContain("unit cost greater than zero");
  expect(container.textContent).toContain("Variant information is unavailable");
});

const editSalesPrice = value => act(() => {
  Simulate.change(container.querySelector('input[aria-label="Selling price for Item A"]'), { target: { value } });
});

test("direct price entry updates margin and saves the exact price through the existing endpoint", async () => {
  await mountPricing();
  const keys = lastProps(Table).columns.map(column => column.key);
  expect(keys.indexOf("directSalesPrice")).toBe(keys.indexOf("marginPercent") + 1);
  editSalesPrice("123.4567");
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("123.4567");
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').value).toBe("35.2");
  expect(container.querySelector('input[aria-label="Selling price for Item B"]').value).toBe("50");
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: { ...pricingRows[0], salesPrice: 123.4567, marginPercent: 35.2 } } });
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenCalledWith("variant-a", { salesPrice: 123.4567, expectedSalesPrice: 90, expectedUnitCost: 80 });
});

test("users can switch between price and margin edits while retaining the original snapshot", async () => {
  await mountPricing();
  editMargin("20");
  const marginCell = container.querySelector('input[aria-label="Margin percentage for Item A"]').closest("td");
  const priceCell = container.querySelector('input[aria-label="Selling price for Item A"]').closest("td");
  expect(marginCell.querySelectorAll("button")).toHaveLength(2);
  expect(priceCell.querySelectorAll("button")).toHaveLength(0);
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe("100");
  editSalesPrice("64");
  expect(marginCell.querySelectorAll("button")).toHaveLength(0);
  expect(priceCell.querySelectorAll("button")).toHaveLength(2);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').value).toBe("-25");
  editMargin("0");
  expect(marginCell.querySelectorAll("button")).toHaveLength(2);
  expect(priceCell.querySelectorAll("button")).toHaveLength(0);
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe("80");
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: { ...pricingRows[0], salesPrice: 80 } } });
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenCalledWith("variant-a", { salesPrice: 80, expectedSalesPrice: 90, expectedUnitCost: 80 });
});

test.each(["", "0", "-1", "12.34567"])("invalid direct price %p prevents saving and keeps a useful error", async value => {
  await mountPricing();
  editSalesPrice(value);
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
});

test("direct price entry works for zero-cost items and reset restores both fields", async () => {
  await mountPricing([{ ...pricingRows[0], unitCost: 0 }]);
  editSalesPrice("25");
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').value).toBe("100");
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(false);
  act(() => { Simulate.click(container.querySelector('button[aria-label="Reset margin for Item A"]')); });
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe("90");
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
});

test("normal item report keeps its read-only margin and price cells", async () => {
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response(pricingRows));
  await mount();
  expect(lastProps(Table).columns.some(column => column.key === "stockAge")).toBe(true);
  expect(container.querySelector('input[type="number"]')).toBeNull();
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
});

test("pricing removes status controls and ignores status filters from old URLs", async () => {
  window.history.replaceState({}, "", "/inventories/pricing-management?status=HEALTHY&needsAttention=true&lowStock=LOW_STOCK&pricing=NO_PRICING_DATA&profitable=PROFITABLE&loss=LOSS&keyword=Coffee&locationId=7");
  await mountPricing();
  expect(Select.mock.calls.some(([props]) => props.name === "status")).toBe(false);
  const request = ProductService.getInventoryStockReport.mock.calls[0][0];
  ["status", "needsAttention", "lowStock", "pricing", "profitable", "loss"].forEach(key => expect(request).not.toHaveProperty(key));
  expect(request).toEqual(expect.objectContaining({ keyword: "Coffee", locationId: "7" }));
  await changeTable("salesPrice", "ascend");
  expect(new URLSearchParams(window.location.search).has("status")).toBe(false);
});

test("pricing removes the brand filter and ignores a brand identifier from an old URL", async () => {
  window.history.replaceState({}, "", "/inventories/pricing-management?brandId=brand&keyword=Coffee");
  await mountPricing();
  expect(Select.mock.calls.some(([props]) => props.name === "brandId")).toBe(false);
  expect(BrandService.get).not.toHaveBeenCalled();
  expect(ProductService.getInventoryStockReport.mock.calls[0][0]).not.toHaveProperty("brandId");
  await changeTable("salesPrice", "ascend");
  expect(new URLSearchParams(window.location.search).has("brandId")).toBe(false);
});

test("the product report retains its brand filter", async () => {
  await mount();
  expect(Select.mock.calls.some(([props]) => props.name === "brandId")).toBe(true);
  expect(BrandService.get).toHaveBeenCalled();
});

test("pricing expected profit uses the backend value and supports server sorting", async () => {
  await mountPricing([{ ...pricingRows[0], expectedProfit: 45 }]);
  const profitColumn = lastProps(Table).columns.find(column => column.key === "expectedProfit");
  expect(profitColumn.render(45)).toBe("45.00");
  await changeTable("expectedProfit", "descend");
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ sortBy: "expectedProfit", sortOrder: "DESC", page: 1 }));
  expect(lastProps(Table).columns.find(column => column.key === "expectedProfit").sortOrder).toBe("descend");
});

const saveFirstPrice = () => settle(() => {
  Simulate.click(container.querySelector('button[aria-label="Save price for Item A"]'));
});

test("saving sends the price snapshot, refreshes the current report, and shows persisted rounding", async () => {
  await mountPricing();
  editMargin("20");
  const saved = { productVariantId: "variant-a", unitCost: 80, salesPrice: 99.9999, marginPercent: 19.9999 };
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: saved } });
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response([{ ...pricingRows[0], ...saved }], 3));
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenCalledWith("variant-a", { salesPrice: 100, expectedSalesPrice: 90, expectedUnitCost: 80 });
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(2);
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3, keyword: "Coffee", locationId: "7" }));
  expect(container.querySelector(".pricing-price-preview")).toBeNull();
  expect(container.textContent).toContain("99.9999");
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).toBeNull();
});

test("a pending save prevents duplicate requests and locks the saving row", async () => {
  await mountPricing();
  editMargin("20");
  let finishSave;
  ItemService.updateSellingPrice.mockImplementationOnce(() => new Promise(resolve => { finishSave = resolve; }));
  const click = () => Simulate.click(container.querySelector('button[aria-label="Save price for Item A"]'));
  await settle(() => { click(); click(); });
  expect(ItemService.updateSellingPrice).toHaveBeenCalledTimes(1);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').disabled).toBe(true);
  expect(container.querySelector('button[aria-label="Reset margin for Item A"]').disabled).toBe(true);
  await settle(() => finishSave({ data: { data: { ...pricingRows[0], salesPrice: 100 } } }));
});

test("conflicts preserve the edit, refresh the report, and require resetting to the new snapshot", async () => {
  await mountPricing();
  editMargin("20");
  ItemService.updateSellingPrice.mockRejectedValueOnce({ response: { status: 409, data: {
    error: { code: "PRICE_OR_COST_CHANGED", message: "Price or cost changed", details: { salesPrice: 95, unitCost: 82 } }
  } } });
  const currentRow = { ...pricingRows[0], salesPrice: 95, unitCost: 82 };
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response([currentRow], 3));
  await saveFirstPrice();
  expect(container.querySelector('[role="alert"]').textContent).toContain("Price or cost changed");
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').value).toBe("20");
  act(() => { Simulate.click(container.querySelector('button[aria-label="Reset margin for Item A"]')); });
  editMargin("20");
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: { ...currentRow, salesPrice: 102.5 } } });
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenLastCalledWith("variant-a", { salesPrice: 102.5, expectedSalesPrice: 95, expectedUnitCost: 82 });
});

test.each([
  [403, "permission"], [404, "unavailable"], [500, "Unable to save"]
])("save error %s keeps the unsaved edit and displays a useful message", async (status, text) => {
  await mountPricing();
  editMargin("20");
  ItemService.updateSellingPrice.mockRejectedValueOnce({ response: { status } });
  await saveFirstPrice();
  expect(container.querySelector('[role="alert"]').textContent).toContain(text);
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("100.00");
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(1);
});

test("editing captures the original cost and price even if report sorting later returns different values", async () => {
  await mountPricing();
  editMargin("20");
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response([{ ...pricingRows[0], salesPrice: 95, unitCost: 82 }]));
  await changeTable("salesPrice", "ascend");
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("100.00");
  ItemService.updateSellingPrice.mockRejectedValueOnce({ response: { status: 409 } });
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenLastCalledWith("variant-a", { salesPrice: 100, expectedSalesPrice: 90, expectedUnitCost: 80 });
});

test("saving preserves four decimal places in the preview and request", async () => {
  await mountPricing([{ ...pricingRows[0], unitCost: 10, salesPrice: 12 }]);
  editMargin("30");
  expect(container.querySelector(".pricing-price-preview strong").textContent).toBe("14.2857");
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: { productVariantId: "variant-a", unitCost: 10, salesPrice: 14.2857, marginPercent: 30 } } });
  await saveFirstPrice();
  expect(ItemService.updateSellingPrice).toHaveBeenLastCalledWith("variant-a", { salesPrice: 14.2857, expectedSalesPrice: 12, expectedUnitCost: 10 });
});

test("a successful save followed by a failed refresh offers report retry without resaving the price", async () => {
  await mountPricing();
  editMargin("20");
  ItemService.updateSellingPrice.mockResolvedValueOnce({ data: { data: { productVariantId: "variant-a", unitCost: 80, salesPrice: 100, marginPercent: 20 } } });
  ProductService.getInventoryStockReport.mockRejectedValueOnce(new Error("Report unavailable"));
  await saveFirstPrice();
  expect(lastProps(Alert).message).toContain("Unable to load");
  expect(ItemService.updateSellingPrice).toHaveBeenCalledTimes(1);
  await settle(() => lastProps(Alert).description.props.onClick());
  expect(ItemService.updateSellingPrice).toHaveBeenCalledTimes(1);
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).toBeNull();
});

const buttonWithText = text => Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes(text));
const enterBatchAmount = value => act(() => {
  Simulate.change(container.querySelector('input[aria-label="Batch margin amount"]'), { target: { value } });
});
const previewBatch = () => act(() => { Simulate.click(buttonWithText('Preview batch prices')); });
const savedBatchResult = row => ({ productVariantId: row.productVariantId, status: 'saved', previousSalesPrice: row.salesPrice,
  unitCost: row.unitCost, salesPrice: row.unitCost + 10, marginPercent: 10 });
const batchResponse = results => ({ data: { data: {
  summary: { requested: results.length, saved: results.filter(row => row.status === 'saved').length, failed: results.filter(row => row.status === 'failed').length }, results
} } });

test('batch amount adds a fixed value to each current-page cost and waits for save', async () => {
  await mountPricing();
  expect(buttonWithText('Preview batch prices').disabled).toBe(true);
  enterBatchAmount('10');
  previewBatch();
  expect(Array.from(container.querySelectorAll('.pricing-price-preview strong')).map(element => element.textContent)).toEqual(['90.00', '50.00']);
  expect(buttonWithText('Save previews').textContent).toContain('(2)');
  expect(container.textContent).toContain('Current page');
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
});

test('batch preview preserves existing edits and skips invalid costs or missing variants', async () => {
  await mountPricing([...pricingRows,
    { ...pricingRows[0], productVariantId: 'invalid-cost', itemName: 'Invalid cost', unitCost: null },
    { ...pricingRows[0], productVariantId: undefined, itemName: 'No variant' }
  ]);
  editMargin('20');
  enterBatchAmount('10');
  previewBatch();
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe('100');
  expect(container.querySelector('input[aria-label="Selling price for Item B"]').value).toBe('50');
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(2);
});

test('batch preview follows the selected category and does not edit items from another category', async () => {
  await mountPricing();
  ProductService.getInventoryStockReport.mockImplementation(params => Promise.resolve(response(params.categoryId === 'selected' ? [pricingRows[1]] : pricingRows, params.page, params.limit)));
  const categorySelect = Select.mock.calls.find(([props]) => props.name === 'categoryId')[0];
  await settle(() => categorySelect.onChange('selected'));
  expect(ProductService.getInventoryStockReport).toHaveBeenLastCalledWith(expect.objectContaining({ categoryId: 'selected', page: 1 }));
  enterBatchAmount('15');
  previewBatch();
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(1);
  expect(container.querySelector('.pricing-price-preview strong').textContent).toBe('55.00');
  expect(container.querySelector('input[aria-label="Selling price for Item A"]')).toBeNull();
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse([{ ...savedBatchResult(pricingRows[1]), salesPrice: 55 }]));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledTimes(1);
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledWith({ marginAmount: 15, categoryId: 'selected',
    items: [{ productVariantId: 'variant-b', expectedSalesPrice: 50, expectedUnitCost: 40 }] }, expect.any(String));
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
});

test('batch saves current-page previews with the existing price and cost conflict checks', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse(pricingRows.map(savedBatchResult)));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledTimes(1);
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledWith({ marginAmount: 10, categoryId: 'cat', items: [
    { productVariantId: 'variant-a', expectedSalesPrice: 90, expectedUnitCost: 80 },
    { productVariantId: 'variant-b', expectedSalesPrice: 50, expectedUnitCost: 40 }
  ] }, expect.any(String));
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(2);
  expect(container.querySelector('.pricing-price-preview')).toBeNull();
});

test('a failed batch price remains visible while other items can save', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse([
    { productVariantId: 'variant-a', status: 'failed', error: { code: 'PRICE_OR_COST_CHANGED', message: 'Price or cost changed. Refresh before saving.' } },
    savedBatchResult(pricingRows[1])
  ]));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledTimes(1);
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('.pricing-price-preview')).not.toBeNull();
  expect(container.querySelector('[role="alert"]').textContent).toContain('Price or cost changed');
  expect(container.querySelector('button[aria-label="Save price for Item B"]')).toBeNull();
});

test('batch saves lock category changes, repeated saves and row editing until complete', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  let finish;
  ItemService.updateSellingPricesBatch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(buttonWithText('Save previews').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').disabled).toBe(true);
  expect(Select.mock.calls.filter(([props]) => props.name === 'categoryId').pop()[0].disabled).toBe(true);
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledTimes(1);
  await settle(() => finish(batchResponse(pricingRows.map(savedBatchResult))));
  expect(ItemService.updateSellingPricesBatch).toHaveBeenCalledTimes(1);
});

test('batch preview stays disabled while a category request is in flight or search is pending', async () => {
  await mountPricing();
  enterBatchAmount('10');
  let finish;
  ProductService.getInventoryStockReport.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  const category = Select.mock.calls.find(([props]) => props.name === 'categoryId')[0];
  await settle(() => category.onChange('selected'));
  expect(buttonWithText('Preview batch prices').disabled).toBe(true);
  await settle(() => finish(response([pricingRows[1]], 1)));
  expect(buttonWithText('Preview batch prices').disabled).toBe(false);
  jest.useFakeTimers();
  act(() => lastProps(Input.Search).onChange({ target: { value: 'New search' } }));
  expect(buttonWithText('Preview batch prices').disabled).toBe(true);
});

test('retries an unconfirmed batch with exactly the same body and idempotency key', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch
    .mockRejectedValueOnce(new Error('Network Error'))
    .mockResolvedValueOnce(batchResponse(pricingRows.map(savedBatchResult)));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(container.querySelector('[role="alert"]').textContent).toContain('Network Error');
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(2);
  const originalRequest = ItemService.updateSellingPricesBatch.mock.calls[0];
  expect(originalRequest[1]).toEqual(expect.any(String));
  expect(originalRequest[1].length).toBeGreaterThan(0);
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[1]).toEqual(originalRequest);
  expect(container.querySelector('.pricing-price-preview')).toBeNull();
});

test('a new batch gets a new idempotency key, even with the same amount and items', async () => {
  await mountPricing();
  enterBatchAmount('10');
  ItemService.updateSellingPricesBatch.mockResolvedValue(batchResponse(pricingRows.map(savedBatchResult)));
  previewBatch();
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  const firstKey = ItemService.updateSellingPricesBatch.mock.calls[0][1];
  previewBatch();
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[1][1]).not.toBe(firstKey);
});

test('changing the amount after preview does not change the saved batch amount', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  enterBatchAmount('20');
  expect(container.textContent).toContain('Previewed margin amount: 10');
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse(pricingRows.map(savedBatchResult)));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[0][0].marginAmount).toBe(10);
});

test('manual edits are preserved and excluded from the cost-plus batch request', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  editMargin('20');
  expect(buttonWithText('Save previews').textContent).toContain('(1)');
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse([savedBatchResult(pricingRows[1])]));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[0][0].items.map(item => item.productVariantId)).toEqual(['variant-b']);
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe('100');
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).not.toBeNull();
});

test('a batch without a category omits categoryId', async () => {
  window.history.replaceState({}, '', '/inventories/pricing-management');
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse(pricingRows.map(savedBatchResult)));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[0][0]).not.toHaveProperty('categoryId');
});

test('a malformed batch response keeps every preview and allows an idempotent retry', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch
    .mockResolvedValueOnce(batchResponse([savedBatchResult(pricingRows[0])]))
    .mockResolvedValueOnce(batchResponse(pricingRows.map(savedBatchResult)));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(2);
  expect(container.querySelector('[role="alert"]').textContent).toContain('could not be confirmed');
  const originalRequest = ItemService.updateSellingPricesBatch.mock.calls[0];
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[1]).toEqual(originalRequest);
});

test('batch permission errors retain previews and show the denial', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  ItemService.updateSellingPricesBatch.mockRejectedValueOnce({ response: { status: 403 } });
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(container.querySelector('[role="alert"]').textContent).toContain('permission');
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(2);
  expect(buttonWithText('Save previews').disabled).toBe(false);
});

const editUnitCost = value => act(() => {
  Simulate.change(container.querySelector('input[aria-label="Unit cost for Item A"]'), { target: { value } });
});
const saveFirstCost = () => settle(() => Simulate.click(container.querySelector('button[aria-label="Save cost for Item A"]')));

test('cost edits use the variant ID and refresh the report after a successful PUT with no response body', async () => {
  await mountPricing();
  editUnitCost('82.1234');
  expect(ItemService.editProductCost).not.toHaveBeenCalled();
  ItemService.editProductCost.mockResolvedValueOnce({ status: 204 });
  ProductService.getInventoryStockReport.mockResolvedValueOnce(response([{ ...pricingRows[0], unitCost: 82.1234 }, pricingRows[1]]));
  await saveFirstCost();
  expect(ItemService.editProductCost).toHaveBeenCalledWith('variant-a', 82.1234);
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(2);
  expect(container.querySelector('input[aria-label="Unit cost for Item A"]').value).toBe('82.1234');
  expect(container.querySelector('button[aria-label="Save cost for Item A"]')).toBeNull();
});

test.each(['', '-1', '1.12345'])('invalid cost %p cannot be submitted', async cost => {
  await mountPricing();
  editUnitCost(cost);
  expect(container.querySelector('button[aria-label="Save cost for Item A"]').disabled).toBe(true);
  await saveFirstCost();
  expect(ItemService.editProductCost).not.toHaveBeenCalled();
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
});

test('zero unit cost can be saved and an unsaved cost can be reset without a request', async () => {
  await mountPricing();
  editUnitCost('10');
  act(() => Simulate.click(container.querySelector('button[aria-label="Reset cost for Item A"]')));
  expect(container.querySelector('input[aria-label="Unit cost for Item A"]').value).toBe('80');
  expect(ItemService.editProductCost).not.toHaveBeenCalled();
  editUnitCost('0');
  ItemService.editProductCost.mockResolvedValueOnce({ status: 200 });
  await saveFirstCost();
  expect(ItemService.editProductCost).toHaveBeenCalledWith('variant-a', 0);
});

test('pending cost edits block row price saving and are excluded from batch pricing', async () => {
  await mountPricing();
  editMargin('20');
  editUnitCost('85');
  expect(container.querySelector('button[aria-label="Save price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Margin percentage for Item A"]').disabled).toBe(true);
  await settle(() => Simulate.click(container.querySelector('button[aria-label="Save price for Item A"]')));
  expect(ItemService.updateSellingPrice).not.toHaveBeenCalled();
  enterBatchAmount('10');
  previewBatch();
  expect(buttonWithText('Save previews').textContent).toContain('(1)');
  ItemService.updateSellingPricesBatch.mockResolvedValueOnce(batchResponse([savedBatchResult(pricingRows[1])]));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(ItemService.updateSellingPricesBatch.mock.calls[0][0].items.map(row => row.productVariantId)).toEqual(['variant-b']);
});

test('saving a cost clears only that variants old batch preview and new previews use the saved cost', async () => {
  await mountPricing();
  enterBatchAmount('10');
  previewBatch();
  editUnitCost('85');
  ItemService.editProductCost.mockResolvedValueOnce({ status: 200 });
  ProductService.getInventoryStockReport.mockImplementation(params => Promise.resolve(response([{ ...pricingRows[0], unitCost: 85 }, pricingRows[1]], params.page, params.limit)));
  await saveFirstCost();
  expect(container.querySelectorAll('.pricing-price-preview')).toHaveLength(1);
  expect(container.querySelector('button[aria-label="Save price for Item A"]')).toBeNull();
  expect(container.querySelector('button[aria-label="Save price for Item B"]')).not.toBeNull();
  previewBatch();
  expect(container.querySelector('input[aria-label="Selling price for Item A"]').value).toBe('95');
});

test('cost failures keep the draft and its existing price preview for review and retry', async () => {
  await mountPricing();
  editMargin('20');
  editUnitCost('85');
  ItemService.editProductCost.mockRejectedValueOnce({ response: { status: 403 } });
  await saveFirstCost();
  expect(container.querySelector('[role="alert"]').textContent).toContain('permission');
  expect(container.querySelector('input[aria-label="Unit cost for Item A"]').value).toBe('85');
  expect(container.querySelector('.pricing-price-preview strong').textContent).toBe('100.00');
  expect(container.querySelector('button[aria-label="Save cost for Item A"]').disabled).toBe(false);
  expect(ProductService.getInventoryStockReport).toHaveBeenCalledTimes(1);
});

test('cost saves lock other writes and filters and prevent duplicate requests', async () => {
  await mountPricing();
  editUnitCost('85');
  let finish;
  ItemService.editProductCost.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  await saveFirstCost();
  expect(container.querySelector('button[aria-label="Save cost for Item A"]').disabled).toBe(true);
  expect(container.querySelector('input[aria-label="Unit cost for Item B"]').disabled).toBe(true);
  expect(buttonWithText('Preview batch prices').disabled).toBe(true);
  expect(Select.mock.calls.filter(([props]) => props.name === 'categoryId').pop()[0].disabled).toBe(true);
  await saveFirstCost();
  expect(ItemService.editProductCost).toHaveBeenCalledTimes(1);
  await settle(() => finish({ status: 204 }));
  expect(container.querySelector('button[aria-label="Save cost for Item A"]')).toBeNull();
});

test('cost editing is disabled for missing variant IDs and during batch saves', async () => {
  await mountPricing([{ ...pricingRows[0], productVariantId: undefined }, pricingRows[1]]);
  expect(container.querySelector('input[aria-label="Unit cost for Item A"]').disabled).toBe(true);
  enterBatchAmount('10');
  previewBatch();
  let finish;
  ItemService.updateSellingPricesBatch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  await settle(() => Simulate.click(buttonWithText('Save previews')));
  expect(container.querySelector('input[aria-label="Unit cost for Item B"]').disabled).toBe(true);
  await settle(() => finish(batchResponse([savedBatchResult(pricingRows[1])])));
});
