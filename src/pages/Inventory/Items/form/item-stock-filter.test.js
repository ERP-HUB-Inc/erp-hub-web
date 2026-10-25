import ItemService from "../../../../services/ItemService";

jest.mock("../../../../helper/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../../../app/modules/common/util", () => jest.fn().mockImplementation(() => ({ getAccessToken: () => "" })));

afterEach(() => jest.restoreAllMocks());

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
