import StockIOService from "./StockIOService";

jest.mock("./BaseService", () => class {
  constructor() { this.baseUrl = "/api"; this.header = {}; }
  initializeRoute() {}
  PUT = jest.fn();
});

test.each(["updateStockInById", "updateStockOutById"])("%s uses the backend's shared stock movement update route", method => {
  const payload = { type: "IN", entries: [{ itemId: "shirt", variantId: "blue" }] };
  StockIOService[method]("movement", payload);
  expect(StockIOService.PUT).toHaveBeenLastCalledWith({ url: "/api/stock-io/movement", data: payload, headers: {} });
});
