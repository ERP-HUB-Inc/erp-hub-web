import {
  batchImpact,
  costAlertKey,
  costCategory,
  filterCostRows,
  grossMarginComparison,
  groupCostRows
} from "./costChangesModel";

const comparison = (changePercent, extra = {}) => ({
  itemId: "item-1",
  variantId: "variant-1",
  itemName: " Logic Board ",
  sku: "PV-123",
  previousCost: 100,
  currentCost: 100 + changePercent,
  changePercent,
  changeAmount: changePercent,
  currentQuantity: 10,
  ...extra
});

test("exact threshold boundaries are affected and categories never overlap", () => {
  const rows = [comparison(5), comparison(-5), comparison(4.99), comparison(-4.99), comparison(0)];
  const groups = groupCostRows(rows, 5);
  expect(groups.increased).toHaveLength(1);
  expect(groups.decreased).toHaveLength(1);
  expect(groups.stable).toHaveLength(3);
  expect(groups.affected).toEqual(rows.slice(0, 2));
});

test("zero variance remains stable with a zero threshold", () => {
  expect(costCategory(comparison(0), 0)).toBe("stable");
  expect(costCategory(comparison(0.01), 0)).toBe("increased");
  expect(costCategory(comparison(-0.01), 0)).toBe("decreased");
});

test.each([-10, -20])("negative query threshold %p uses its magnitude for categories", threshold => {
  const magnitude = Math.abs(threshold);
  expect(costCategory(comparison(-magnitude), threshold)).toBe("decreased");
  expect(costCategory(comparison(-magnitude + 0.01), threshold)).toBe("stable");
  expect(costCategory(comparison(magnitude), threshold)).toBe("increased");
  expect(costCategory(comparison(0), threshold)).toBe("stable");
});

test.each([0, null, undefined, "", "  ", -1, NaN])("invalid previous cost %p is excluded", previousCost => {
  const groups = groupCostRows([comparison(5, { previousCost })], 5);
  expect(groups.unavailable).toHaveLength(1);
  expect(groups.affected).toHaveLength(0);
  expect(groups.stable).toHaveLength(0);
});

test("missing current costs or percentages never become confirmed zero comparisons", () => {
  expect(costCategory(comparison(5, { currentCost: null }), 5)).toBe("unavailable");
  expect(costCategory(comparison(null), 5)).toBe("unavailable");
  expect(costCategory(comparison("5", { previousCost: "100", currentCost: "105" }), 5)).toBe("increased");
});

test("search matches product, variant and SKU without changing category totals", () => {
  const rows = [comparison(5), comparison(-5, { variantName: "OLED" })];
  const groups = groupCostRows(rows, 5);
  expect(filterCostRows(groups.affected, " LOGIC ")).toHaveLength(2);
  expect(filterCostRows(groups.affected, "pv-123")).toHaveLength(2);
  expect(filterCostRows(groups.affected, "oled")).toHaveLength(1);
  expect(filterCostRows(groups.affected, "missing")).toHaveLength(0);
  expect(groups.affected).toHaveLength(2);
});

test("batch impact uses current quantity and preserves unavailable versus zero", () => {
  expect(batchImpact([comparison(5), comparison(2)])).toBe(70);
  expect(batchImpact([comparison(-5)])).toBe(-50);
  expect(batchImpact([comparison(5, { currentQuantity: 0 })])).toBe(0);
  expect(batchImpact([comparison(5, { currentQuantity: null })])).toBeNull();
  expect(batchImpact([comparison(5, { changeAmount: null })])).toBeNull();
  expect(batchImpact([])).toBeNull();
});

test("dismissed alert identity changes with the comparison, quantity or filters", () => {
  const initial = costAlertKey([comparison(5)], "october");
  expect(costAlertKey([comparison(5)], "october")).toBe(initial);
  expect(costAlertKey([comparison(6)], "october")).not.toBe(initial);
  expect(costAlertKey([comparison(5, { currentQuantity: 20 })], "october")).not.toBe(initial);
  expect(costAlertKey([comparison(5)], "september")).not.toBe(initial);
});

test("margin display preserves backend percentages without recalculating from costs", () => {
  const margin = grossMarginComparison({
    sellingPrice: 8,
    previousGrossMarginPercent: 25,
    currentGrossMarginPercent: 61.54,
    pricingBasis: "CURRENT_RETAIL"
  });
  expect(margin).toMatchObject({ current: 61.54, previous: 25, tone: "positive" });
  expect(margin.difference).toBeCloseTo(36.54);
});

test("equal supplied margins are unchanged", () => {
  expect(grossMarginComparison({ previousGrossMarginPercent: 25, currentGrossMarginPercent: 25 }))
    .toEqual({ current: 25, previous: 25, difference: 0, tone: "neutral" });
});

test("missing margins remain unavailable rather than becoming zero", () => {
  expect(grossMarginComparison({ currentGrossMarginPercent: null, previousGrossMarginPercent: 25 }))
    .toMatchObject({ current: null, previous: 25, difference: null, tone: "neutral" });
  expect(grossMarginComparison({ currentGrossMarginPercent: 61.54 }))
    .toMatchObject({ current: 61.54, previous: null, difference: null, tone: "neutral" });
});

test("a confirmed zero margin displays as zero and indicates a fall from a positive margin", () => {
  expect(grossMarginComparison({ previousGrossMarginPercent: 25, currentGrossMarginPercent: 0 }))
    .toEqual({ current: 0, previous: 25, difference: -25, tone: "negative" });
});

test("a negative current margin remains a warning even when it improves", () => {
  expect(grossMarginComparison({ previousGrossMarginPercent: -10, currentGrossMarginPercent: -5 }))
    .toEqual({ current: -5, previous: -10, difference: 5, tone: "negative" });
});

test.each([
  ["sellingPrice", 8],
  ["previousGrossMarginPercent", 25],
  ["currentGrossMarginPercent", 61.54],
  ["pricingBasis", "CURRENT_RETAIL"]
])("changed %s resets a dismissed alert", (field, value) => {
  expect(costAlertKey([comparison(5, { [field]: value })], "october"))
    .not.toBe(costAlertKey([comparison(5)], "october"));
});
