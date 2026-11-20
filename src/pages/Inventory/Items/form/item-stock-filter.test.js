import ItemService from "../../../../services/ItemService";

jest.mock("../../../../helper/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../../../app/modules/common/util", () => jest.fn().mockImplementation(() => ({ getAccessToken: () => "" })));

afterEach(() => jest.restoreAllMocks());

test("saves only the requested variant selling price with its expected price and cost", () => {
  const patch = jest.spyOn(ItemService, "PATCH").mockReturnValue(undefined);
  ItemService.updateSellingPrice("variant-a", { salesPrice: 14.2857, expectedSalesPrice: 12, expectedUnitCost: 10, margin: 30 });
  const request = patch.mock.calls[0][0];
  expect(new URL(request.url, "http://localhost").pathname.endsWith("/items/variants/variant-a/selling-price")).toBe(true);
  expect(request.data).toEqual({ salesPrice: 14.2857, expectedSalesPrice: 12, expectedUnitCost: 10 });
});

test.each(["name", "itemType", "incomingStock", "quantity", "price"])("serializes %s server sorting alongside filters and pagination", sortField => {
  const get = jest.spyOn(ItemService, "GET").mockReturnValue(undefined);
  ItemService.get({ sortField, sortOrder: "DESC", limit: 15, offset: 15, search: "Coffee", locationId: 7, lowStockAlert: true });
  const request = get.mock.calls[0][0];
  const query = new URL(request.url, "http://localhost").searchParams;
  expect(query.get("sortField")).toBe(sortField);
  expect(query.get("sortOrder")).toBe("DESC");
  expect(query.get("limit")).toBe("15");
  expect(query.get("offset")).toBe("15");
  expect(query.get("search")).toBe("Coffee");
  expect(query.get("locationId")).toBe("7");
  expect(request.params).toEqual({ lowStockAlert: true });
});

test("omits sorting parameters when default ordering is requested", () => {
  const get = jest.spyOn(ItemService, "GET").mockReturnValue(undefined);
  ItemService.get({ limit: 15, offset: 0 });
  const query = new URL(get.mock.calls[0][0].url, "http://localhost").searchParams;
  expect(query.has("sortField")).toBe(false);
  expect(query.has("sortOrder")).toBe(false);
});

test("forwards the out-of-stock filter alongside existing list options", () => {
  const get = jest.spyOn(ItemService, "GET").mockReturnValue(undefined);

  ItemService.get({ outOfStock: true, limit: 20, offset: 20, locationId: 7, search: "Coffee" });

  const request = get.mock.calls[0][0];
  expect(request.params).toEqual({ outOfStock: true });
  const query = new URL(request.url, "http://localhost").searchParams;
  expect(query.get("limit")).toBe("20");
  expect(query.get("offset")).toBe("20");
  expect(query.get("locationId")).toBe("7");
  expect(query.get("search")).toBe("Coffee");
});

test.each([
  [{}, {}],
  [{ outOfStock: false }, {}],
  [{ lowStockAlert: true }, { lowStockAlert: true }],
  [{ marginReviewAlert: true }, { marginReviewAlert: true }]
])("omits the out-of-stock filter for other list requests: %p", (options, expected) => {
  const get = jest.spyOn(ItemService, "GET").mockReturnValue(undefined);

  ItemService.get(options);

  expect(get.mock.calls[0][0].params).toEqual(expected);
});
