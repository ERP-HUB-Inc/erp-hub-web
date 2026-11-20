import ProductService from "./ProductService";

jest.mock("../BaseService", () => class BaseService {
  initializeRoute() {}
  setHeader() {}
  generateAPIUrl() { return "http://localhost"; }
  GET(request) { return request; }
});

test("encodes report sorting, pagination, and filter values without changing query parameters", () => {
  const params = { sortBy: "unitCost", sortOrder: "DESC", page: 1, limit: 15, keyword: "Coffee & Tea + Milk", categoryId: "category/1", status: "LOW_STOCK,OUT_OF_STOCK" };
  const request = ProductService.getInventoryStockReport(params);
  const url = new URL(request.url);
  expect(url.pathname).toBe("/report/products");
  Object.entries(params).forEach(([key, value]) => expect(url.searchParams.get(key)).toBe(String(value)));
});
