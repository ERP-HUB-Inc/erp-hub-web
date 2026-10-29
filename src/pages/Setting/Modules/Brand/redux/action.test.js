import BrandAction from "./action";
import BrandService from "@services/BrandService";

jest.mock("@services/BrandService", () => ({ get: jest.fn() }));

test("brand listing uses an options object and the backend search parameter", () => {
  const dispatch = jest.fn();
  BrandService.get.mockReturnValue(Promise.resolve({}));
  BrandAction.fetch(20, 40, "name", "ASC", "", "Acme")(dispatch);
  expect(BrandService.get).toHaveBeenCalledWith({ limit: 20, offset: 40, sortField: "name", sortOrder: "ASC", filter: "", search: "Acme" });
  expect(dispatch).toHaveBeenCalledWith({ type: "REQUEST_BRAND", payload: expect.any(Promise) });
});
