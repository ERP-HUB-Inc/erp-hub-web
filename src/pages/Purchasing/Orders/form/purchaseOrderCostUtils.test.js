import {
  calculatePurchaseOrderTotals,
  restoreCharges,
  serializeCharges,
  validateCharges,
} from "./purchaseOrderCostUtils";

const items = [{ itemId: 1, quantity: 2, cost: 50 }, { itemId: null, quantity: null, cost: null }];

test("separates supplier payable from third-party costs and adds exclusive tax", () => {
  const totals = calculatePurchaseOrderTotals(
    items,
    { discount: 10, shippingFee: 5, tax: 9, taxInclusive: false },
    [
      { amount: 3, payee: "SUPPLIER" },
      { amount: 7, payee: "THIRD_PARTY" },
    ]
  );

  expect(totals.supplierPayable).toBe(107);
  expect(totals.estimatedTotalCost).toBe(114);
});

test("included tax is displayed but not added twice", () => {
  const totals = calculatePurchaseOrderTotals(
    items,
    { discount: 0, shippingFee: 0, tax: 9, taxInclusive: true },
    []
  );

  expect(totals.tax).toBe(9);
  expect(totals.supplierPayable).toBe(100);
});

test("charge validation and update serialization preserve charge IDs", () => {
  const charges = restoreCharges([{ id: 42, type: "OTHER", description: "Inspection", amount: 4, payee: "THIRD_PARTY" }]);
  expect(validateCharges(charges)).toBeNull();
  expect(serializeCharges(charges)).toEqual([{
    id: 42,
    type: "OTHER",
    description: "Inspection",
    amount: 4,
    payee: "THIRD_PARTY",
    includeInInventoryCost: false,
  }]);
  expect(validateCharges([{ ...charges[0], amount: -1 }])).toMatch(/additional charge 1/);
  expect(validateCharges([{ ...charges[0], description: " " }])).toMatch(/additional charge 1/);
});
