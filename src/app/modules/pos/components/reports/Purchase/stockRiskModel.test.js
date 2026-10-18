import {
  filterStockRows,
  groupStockRows,
  stockCoverage,
  stockPageRange,
  stockRiskCategory,
  stockValuation
} from "./stockRiskModel";

const zeroSales = {
  itemId: "item-1",
  itemName: "U90 ស្ពេត្រូលាបក្រៅ​ស 18L",
  sku: null,
  currentStock: 10,
  soldQuantity: 0,
  averageDailySales: 0,
  stockCoverageDays: null,
  thresholdDays: 30,
  targetStock: 0,
  excessStock: 10,
  risk: "CRITICAL"
};

test("the supplied zero-sales response displays infinity as text, not a numeric JSON value", () => {
  expect(stockCoverage(zeroSales)).toEqual({ label: "No Sales (∞)", detail: "Zero movement" });
  expect(JSON.parse(JSON.stringify(zeroSales)).stockCoverageDays).toBeNull();
});

test.each([null, undefined, ""])("missing sales history %p is not confirmed zero movement", missing => {
  expect(stockCoverage({ ...zeroSales, averageDailySales: missing }))
    .toEqual({ label: "—", detail: "Sales history unavailable" });
  expect(stockCoverage({ ...zeroSales, soldQuantity: missing }))
    .toEqual({ label: "—", detail: "Sales history unavailable" });
});

test("zero or missing current stock does not become infinite coverage", () => {
  expect(stockCoverage({ ...zeroSales, currentStock: 0 }))
    .toEqual({ label: "—", detail: "No stock on hand" });
  expect(stockCoverage({ ...zeroSales, currentStock: null }).label).toBe("—");
});

test("reported coverage and policy values are preserved instead of recomputed from rounded velocity", () => {
  const row = { ...zeroSales, soldQuantity: 105, averageDailySales: 5.83, stockCoverageDays: 61.7, thresholdDays: 60 };
  expect(stockCoverage(row)).toEqual({ label: "61.7 Days", detail: "1.7d above threshold" });
  expect(stockCoverage({ ...row, stockCoverageDays: 60 }).detail).toBe("Within coverage threshold");
});

test("known numeric zero coverage remains distinguishable from missing coverage", () => {
  expect(stockCoverage({ ...zeroSales, stockCoverageDays: 0 }).label).toBe("0.0 Days");
});

test("risk groups are mutually exclusive and preserve backend risk policy", () => {
  const rows = [
    zeroSales,
    { ...zeroSales, risk: "HIGH", stockCoverageDays: 20 },
    { ...zeroSales, risk: "NORMAL", stockCoverageDays: 600 },
    { ...zeroSales, risk: null }
  ];
  const groups = groupStockRows(rows);
  expect(groups.all).toHaveLength(4);
  expect(groups.critical).toHaveLength(1);
  expect(groups.high).toHaveLength(1);
  expect(groups.healthy).toHaveLength(1);
  expect(groups.unavailable).toHaveLength(1);
  expect(stockRiskCategory("HEALTHY")).toBe("healthy");
  expect(stockRiskCategory("HIGH_RISK")).toBe("high");
  expect(stockRiskCategory("NEW_STATUS")).toBe("unavailable");
});

test("search supports Khmer, case-insensitive SKU and variant names without mutating rows", () => {
  const rows = [zeroSales, { ...zeroSales, itemName: "Cable", variantName: "Shielded", sku: "PV-123", risk: "NORMAL" }];
  expect(filterStockRows(rows, "ស្ពេត្រូ")).toEqual([zeroSales]);
  expect(filterStockRows(rows, " pv-123 ")).toEqual([rows[1]]);
  expect(filterStockRows(rows, "SHIELDED")).toEqual([rows[1]]);
  expect(groupStockRows(filterStockRows(rows, "missing")).all).toHaveLength(0);
  expect(rows).toHaveLength(2);
});

test("pagination ranges handle empty results and clamp after search reduces the result set", () => {
  expect(stockPageRange(0, 1, 20)).toEqual({ current: 1, start: 0, end: 0 });
  expect(stockPageRange(45, 2, 20)).toEqual({ current: 2, start: 21, end: 40 });
  expect(stockPageRange(45, 3, 20)).toEqual({ current: 3, start: 41, end: 45 });
  expect(stockPageRange(5, 3, 20)).toEqual({ current: 1, start: 1, end: 5 });
});

test("tied capital consumes the backend aggregate and report currency", () => {
  expect(stockValuation({ totalExcessStockValue: 380, currencyCode: "USD", valuationUnavailableProducts: 0 }))
    .toEqual({ amount: 380, currency: "USD", unavailableReason: null });
});

test("confirmed zero valuation remains available", () => {
  expect(stockValuation({ totalExcessStockValue: 0, currencyCode: "USD", valuationUnavailableProducts: 0 }))
    .toEqual({ amount: 0, currency: "USD", unavailableReason: null });
});

test("null valuation explains missing product costs rather than presenting a partial total", () => {
  const valuation = stockValuation({ totalExcessStockValue: null, currencyCode: "USD", valuationUnavailableProducts: 2 });
  expect(valuation.amount).toBeNull();
  expect(valuation.unavailableReason).toBe("Valuation is unavailable for 2 excess-stock products.");
});

test("missing currency never falls back to an assumed currency", () => {
  expect(stockValuation({ totalExcessStockValue: 380, currencyCode: null }).unavailableReason)
    .toBe("Report currency is unavailable.");
  expect(stockValuation({ totalExcessStockValue: 0, currencyCode: " " }).unavailableReason)
    .toBe("Report currency is unavailable.");
});

test("absent aggregate data remains unavailable", () => {
  expect(stockValuation({ currencyCode: "USD" }))
    .toEqual({ amount: null, currency: "USD", unavailableReason: "Excess-stock valuation is unavailable." });
});
