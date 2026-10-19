import {
  filterPurchaseSalesRows,
  grossProfitMetrics,
  periodInsight,
  profitBadge,
  purchaseSalesPage,
  unitComparison
} from "./purchaseSalesModel";

const sample = {
  itemId: "item-1",
  variantId: "variant-1",
  itemName: " XS Max Board",
  variantName: "",
  sku: "SKU-0001",
  purchaseQuantity: 15,
  purchaseAmount: 395,
  salesQuantity: 18,
  salesAmount: 144,
  salesCost: 976.83,
  grossProfit: -832.83,
  quantityDifference: -3,
  activityStatus: "SALES_AHEAD"
};

test("supplied loss uses backend gross profit and the same sales revenue for margin", () => {
  const metrics = grossProfitMetrics(sample);
  expect(metrics).toMatchObject({ profit: -832.83, state: "loss", tone: "negative" });
  expect(metrics.margin).toBeCloseTo(-578.3541667);
  expect(profitBadge(metrics)).toBe("-578.4% · Loss detected");
});

test("purchase spend is not subtracted from revenue to calculate product profit", () => {
  expect(grossProfitMetrics({ ...sample, purchaseAmount: 10000 }))
    .toEqual(grossProfitMetrics(sample));
});

test("confirmed no sales displays Awaiting Sale and no profit or margin", () => {
  const metrics = grossProfitMetrics({ ...sample, salesQuantity: 0, salesAmount: 0, salesCost: 0, grossProfit: 0 });
  expect(metrics).toEqual({ profit: null, margin: null, state: "awaiting", tone: "neutral" });
  expect(profitBadge(metrics)).toBe("Awaiting Sale");
});

test("confirmed break-even remains zero rather than unavailable", () => {
  const metrics = grossProfitMetrics({ ...sample, grossProfit: 0 });
  expect(metrics).toEqual({ profit: 0, margin: 0, state: "breakEven", tone: "neutral" });
  expect(profitBadge(metrics)).toBe("Break-even");
});

test("unknown profit is not converted to zero or calculated from incomplete inputs", () => {
  expect(grossProfitMetrics({ ...sample, grossProfit: null }))
    .toEqual({ profit: null, margin: null, state: "unavailable", tone: "neutral" });
});

test.each([0, -10, null])("nonpositive or unavailable revenue %p never creates infinite margins", salesAmount => {
  expect(grossProfitMetrics({ ...sample, salesAmount }))
    .toMatchObject({ profit: -832.83, margin: null, state: "loss" });
});

test("a reported loss with no units sold is not hidden by an Awaiting Sale label", () => {
  expect(grossProfitMetrics({ salesQuantity: 0, salesAmount: 0, grossProfit: -20 }))
    .toMatchObject({ profit: -20, margin: null, state: "loss" });
});

test("bought and sold bar normalizes to their combined quantity", () => {
  const units = unitComparison(sample);
  expect(units.difference).toBe(-3);
  expect(units.boughtWidth).toBeCloseTo(15 / 33 * 100);
  expect(units.soldWidth).toBeCloseTo(18 / 33 * 100);
  expect(units.boughtWidth + units.soldWidth).toBeCloseTo(100);
});

test("zero, missing and negative quantities produce neutral bars", () => {
  expect(unitComparison({ purchaseQuantity: 0, salesQuantity: 0 }))
    .toMatchObject({ boughtWidth: 0, soldWidth: 0, difference: 0 });
  expect(unitComparison({ purchaseQuantity: null, salesQuantity: 5 }))
    .toMatchObject({ boughtWidth: 0, soldWidth: 0, difference: null, comparable: false });
  expect(unitComparison({ purchaseQuantity: -5, salesQuantity: 10 }))
    .toMatchObject({ boughtWidth: 0, soldWidth: 0, comparable: false });
});

test("backend period movement is preserved, including a reported zero", () => {
  expect(unitComparison({ ...sample, quantityDifference: 0 }).difference).toBe(0);
  expect(unitComparison({ purchaseQuantity: "15", salesQuantity: "18" }).difference).toBe(-3);
});

test("period activity cannot become unsupported inventory or price recommendations", () => {
  const insight = periodInsight({ ...sample, grossProfit: 10 });
  expect(insight.label).toBe("Sales ahead");
  expect(insight.description).not.toMatch(/reorder|safe reserve|FIFO|new batch|retail.*below/i);
  expect(periodInsight({ ...sample, activityStatus: null, grossProfit: 10 }).label)
    .toBe("Inventory status unavailable");
});

test("realized loss takes priority without claiming the current retail price is below cost", () => {
  const insight = periodInsight(sample);
  expect(insight).toMatchObject({ label: "Realized loss", tone: "negative" });
  expect(insight.description).not.toMatch(/retail|FIFO|legacy|batch/i);
});

test("Khmer search, SKU, category and period activity combine without mutating data", () => {
  const row = { ...sample, itemName: "ទំនិញ XS Max", categoryName: "Components", variantName: "OLED" };
  const rows = [row, { ...sample, itemId: "other", categoryName: "Cables", activityStatus: "PURCHASE_ONLY" }];
  expect(filterPurchaseSalesRows(rows, { search: "ទំនិញ", activity: "SALES_AHEAD", category: "Components" }))
    .toEqual([row]);
  expect(filterPurchaseSalesRows(rows, { search: " sku-0001 ", activity: "", category: "" })).toHaveLength(2);
  expect(filterPurchaseSalesRows(rows, { search: "oled", activity: "", category: "" })).toEqual([row]);
  expect(filterPurchaseSalesRows(rows, { search: "missing", activity: "", category: "" })).toHaveLength(0);
  expect(rows).toHaveLength(2);
});

test("page ranges match the page size and clamp after filtering", () => {
  expect(purchaseSalesPage(32, 4, 10)).toEqual({ current: 4, last: 4, start: 31, end: 32 });
  expect(purchaseSalesPage(32, 2, 20)).toEqual({ current: 2, last: 2, start: 21, end: 32 });
  expect(purchaseSalesPage(2, 4, 10)).toEqual({ current: 1, last: 1, start: 1, end: 2 });
  expect(purchaseSalesPage(0, 1, 10)).toEqual({ current: 1, last: 1, start: 0, end: 0 });
});
