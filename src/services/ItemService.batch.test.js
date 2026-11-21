import ItemService from './ItemService';

jest.mock('./BaseService', () => class {
  constructor() {
    this.baseUrl = 'https://api.example.test/configured-prefix';
    this.header = { 'Content-Type': 'application/json' };
    this.PATCH = jest.fn();
    this.PUT = jest.fn();
  }
  initializeRoute() {}
  setHeader() { this.header.Authorization = 'Bearer fixture-token'; }
});

beforeEach(() => { ItemService.PATCH.mockClear(); ItemService.PUT.mockClear(); });

test('sends one batch PATCH through the configured API prefix with auth and an idempotency key', () => {
  const items = [{ productVariantId: 'variant-a', expectedSalesPrice: 90, expectedUnitCost: 80 }];
  ItemService.updateSellingPricesBatch({ marginAmount: 10, categoryId: 'category-a', items }, 'batch-key-1');
  expect(ItemService.PATCH).toHaveBeenCalledWith({
    url: 'https://api.example.test/configured-prefix/items/variants/selling-price/batch',
    data: { marginAmount: 10, categoryId: 'category-a', items },
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fixture-token', 'Idempotency-Key': 'batch-key-1' }
  });
  expect(ItemService.header).not.toHaveProperty('Idempotency-Key');
});

test('omits categoryId when all categories are selected', () => {
  ItemService.updateSellingPricesBatch({ marginAmount: 10, categoryId: '', items: [] }, 'batch-key-2');
  expect(ItemService.PATCH.mock.calls[0][0].data).not.toHaveProperty('categoryId');
});

test('saves cost with the variant ID and only newCost, without an idempotency key', () => {
  ItemService.updateSellingPricesBatch({ marginAmount: 10, items: [] }, 'batch-key');
  ItemService.editProductCost('variant/a', 80.1234);
  expect(ItemService.PUT).toHaveBeenCalledWith({
    url: 'https://api.example.test/configured-prefix/items/edit_cost/variant%2Fa',
    data: { newCost: 80.1234 },
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fixture-token' }
  });
});
