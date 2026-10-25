import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import ItemSummary, { ItemSummaryCards } from "./item-summary";
import useDashboardQuery from "../../../Dashboard/useDashboardQuery";

jest.mock("../../../Dashboard/useDashboardQuery", () => jest.fn());

// These presentation tests do not make API requests.
jest.mock("../../../../helper/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../../../app/modules/common/util", () => jest.fn().mockImplementation(() => ({ getAccessToken: () => "" })));

const data = {
  inventoryValuation: { amount: 3138.34, method: "PRODUCT_VARIANT_COST", variantCount: 42 },
  pricingAndMarginAlerts: { total: 238, belowCost: 51, nonPositiveSalesPrice: 194 },
  stockHealth: { lowStock: 0, outOfStock: 1 },
  incomingStock: { quantity: 0, purchaseOrderCount: 0, variantCount: 0 }
};
const currency = value => `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
let container;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});
const card = label => container.querySelector(`article[aria-label="${label}"]`);
const value = label => card(label).querySelector(".item-summary-value").textContent;
const renderCards = query => act(() => {
  ReactDOM.render(<ItemSummaryCards query={{ data, loading: false, error: "", ...query }} formatCurrency={currency} />, container);
});

test.each([12, 0, null, undefined, -1])("reports the summary out-of-stock count to the tabs: %p", outOfStock => {
  const onAlertCountsChange = jest.fn();
  useDashboardQuery.mockReturnValue({
    data: { lowStockAlert: 2, marginReviewAlert: 3, stockHealth: { outOfStock } },
    loading: false,
    error: ""
  });

  act(() => {
    ReactDOM.render(<ItemSummary formatCurrency={currency} onAlertCountsChange={onAlertCountsChange} />, container);
  });

  expect(onAlertCountsChange).toHaveBeenCalledWith(2, 3, outOfStock >= 0 && outOfStock !== null ? outOfStock : null);
});

test("shows the inventory valuation variant count, preserving zero and unavailable states", () => {
  renderCards();
  const footer = () => card("Total Inventory Valuation").querySelector(".item-summary-card-footer");
  expect(footer().textContent).toContain("Stock value at cost");
  expect(footer().textContent).toContain("42 product variations");
  renderCards({ data: { inventoryValuation: { ...data.inventoryValuation, variantCount: 0 } } });
  expect(footer().textContent).toContain("0 product variations");
  renderCards({ data: { inventoryValuation: { amount: 0 } } });
  expect(footer().textContent).toContain("— product variations");
});

test("shows API totals, overlapping pricing conditions, and the stock breakdown", () => {
  renderCards();
  expect(container.querySelectorAll("article")).toHaveLength(4);
  expect(value("Total Inventory Valuation")).toBe("$3,138.34");
  expect(value("Pricing & Margin Health")).toBe("238");
  expect(card("Pricing & Margin Health").textContent).toContain("51");
  expect(card("Pricing & Margin Health").textContent).toContain("194");
  expect(value("Stock Health & Deficits")).toBe("1");
  expect(value("Incoming Purchase Orders")).toBe("0");
  expect(container.textContent).toContain("No incoming purchase orders");
  expect(container.textContent).not.toMatch(/MoM|Retail value|Active SKUs|Toul Kork|lost revenue/);
});

test.each([
  [{ outOfStock: 12, lowStock: 32 }, "12", "32", "44"],
  [{ outOfStock: 0, lowStock: 0 }, "0", "0", "0"],
  [{ outOfStock: null, lowStock: 7 }, "—", "7", "—"]
])("stock alert boxes preserve separate API counts and distinguish missing data: %j", (stockHealth, outCount, lowCount, total) => {
  renderCards({ data: { ...data, stockHealth } });
  const stockCard = card("Stock Health & Deficits");
  const panels = stockCard.querySelector("[role='group'][aria-label='Stock alerts']");
  expect(panels.children).toHaveLength(2);
  expect(panels.querySelector(".item-summary-stock-out").textContent).toContain("Out of Stock");
  expect(panels.querySelector(".item-summary-stock-out strong").textContent).toBe(outCount);
  expect(panels.querySelector(".item-summary-stock-low").textContent).toContain("Low Stock");
  expect(panels.querySelector(".item-summary-stock-low strong").textContent).toBe(lowCount);
  expect(panels.querySelectorAll(".item-summary-stock-dot[aria-hidden='true']")).toHaveLength(2);
  expect(value("Stock Health & Deficits")).toBe(total);
});

test("keeps missing and invalid metrics unavailable while preserving usable cards", () => {
  renderCards({ data: {
    inventoryValuation: { amount: null },
    pricingAndMarginAlerts: { total: -1 },
    stockHealth: { lowStock: 2 },
    incomingStock: { quantity: NaN }
  } });
  ["Total Inventory Valuation", "Pricing & Margin Health", "Stock Health & Deficits", "Incoming Purchase Orders"].forEach(label => expect(value(label)).toBe("—"));
  expect(container.textContent).not.toContain("Healthy");
  renderCards({ data: { stockHealth: { lowStock: 2, outOfStock: 3 } } });
  expect(value("Stock Health & Deficits")).toBe("5");
  expect(value("Total Inventory Valuation")).toBe("—");
});

test("confirmed zero alerts use healthy states and zero incoming orders stay visible", () => {
  renderCards({ data: {
    inventoryValuation: { amount: 0, method: "PRODUCT_VARIANT_COST" },
    pricingAndMarginAlerts: { total: 0, belowCost: 0, nonPositiveSalesPrice: 0 },
    stockHealth: { lowStock: 0, outOfStock: 0 },
    incomingStock: data.incomingStock
  } });
  expect(value("Total Inventory Valuation")).toBe("$0.00");
  expect(card("Pricing & Margin Health").className).toContain("card-teal");
  expect(card("Stock Health & Deficits").className).toContain("card-teal");
  expect(container.textContent).toContain("No pricing alerts");
  expect(container.textContent).toContain("No stock alerts");
});

test("loading preserves all cards and hides stale figures; errors explain how to refresh", () => {
  renderCards({ loading: true });
  expect(container.querySelectorAll("article")).toHaveLength(4);
  expect(container.querySelectorAll(".ant-skeleton")).toHaveLength(4);
  expect(container.querySelector("section").getAttribute("aria-busy")).toBe("true");
  expect(container.textContent).not.toContain("3,138");
  renderCards({ error: "Request failed" });
  expect(container.textContent).toContain("Unable to load inventory summary");
  expect(value("Total Inventory Valuation")).toBe("—");
  expect(container.textContent).toContain("Use the item list Refresh button to try again.");
  expect(container.querySelector("button")).toBeNull();
});

