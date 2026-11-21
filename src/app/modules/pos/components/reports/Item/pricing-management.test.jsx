import { calculateCostPlusPreview, calculatePricingPreview, getPricingDraftPreview, readPricingBatchResults, validatePricingCost } from "./pricing-management";

test.each([0, 80, 80.1234, '80.1234'])('accepts valid unit cost %p', cost => {
  expect(validatePricingCost(cost)).toBe('');
});

test.each([null, undefined, '', ' ', -1, NaN, Infinity, 'invalid', 1.12345])('rejects invalid unit cost %p', cost => {
  expect(validatePricingCost(cost)).not.toBe('');
});

test.each([[80, 10, 90], [40, 10, 50], [0, 10, 10], [80, 0, 80], [0.1, 0.2, 0.3], ['80', '10', 90]])(
  'cost %p plus margin amount %p previews price %p', (cost, amount, price) => {
    expect(calculateCostPlusPreview(cost, amount)).toEqual({ price, error: '' });
  }
);

test.each([[null, 10], ['', 10], [-1, 10], [Infinity, 10], [80, null], [80, ''], [80, -1], [80, Infinity], [0, 0]])(
  'rejects invalid cost %p or margin amount %p', (cost, amount) => {
    expect(calculateCostPlusPreview(cost, amount).error).not.toBe('');
  }
);

test.each([
  [80, 20, 100], [80, 0, 80], [80, -25, 64], [10, 30, 14.2857], ["80", "20", 100]
])("cost %p at margin %p previews price %p", (cost, margin, price) => {
  expect(calculatePricingPreview(cost, margin)).toEqual({ price, error: "" });
});

test.each([0.0001, 64, 123.4567])("direct price %p remains exact rather than being recalculated from rounded margin", salesPrice => {
  expect(getPricingDraftPreview({ source: "price", salesPrice, expectedUnitCost: 80 })).toEqual({ price: salesPrice, error: "" });
});

test.each([null, "", -1, 0, Infinity, NaN, 1.12345])("direct price %p is invalid", salesPrice => {
  expect(getPricingDraftPreview({ source: "price", salesPrice, expectedUnitCost: 80 }).price).toBeNull();
});

test.each([
  [0, 20], [-1, 20], [null, 20], ["", 20], [undefined, 20], [Infinity, 20],
  [80, null], [80, ""], [80, "invalid"], [80, 100], [80, 101], [80, Infinity]
])("cost %p and margin %p cannot produce a preview", (cost, margin) => {
  const preview = calculatePricingPreview(cost, margin);
  expect(preview.price).toBeNull();
  expect(preview.error).not.toBe("");
});

test('rejects an incomplete batch response instead of claiming unconfirmed saves', () => {
  const items = [{ productVariantId: 'variant-a' }, { productVariantId: 'variant-b' }];
  const result = { productVariantId: 'variant-a', status: 'saved', salesPrice: 90, unitCost: 80, marginPercent: 11.11 };
  expect(() => readPricingBatchResults({ data: { data: { results: [result] } } }, items)).toThrow('could not be confirmed');
  expect(() => readPricingBatchResults({ data: { data: { results: [result, result] } } }, items)).toThrow('could not be confirmed');
});
