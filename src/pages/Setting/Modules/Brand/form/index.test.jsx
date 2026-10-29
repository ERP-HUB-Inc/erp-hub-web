import BrandPage from "./index";
import BrandAction from "../redux/action";
import BrandService from "@services/BrandService";

jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@services/BrandService", () => ({ archive: jest.fn() }));
jest.mock("../redux/action", () => ({ fetch: jest.fn() }));
const makePage = () => {
  const page = new BrandPage({ dispatch: jest.fn(), list: {}, history: { push: jest.fn() } });
  page.setState = next => { page.state = { ...page.state, ...next }; };
  return page;
};
beforeEach(() => { jest.clearAllMocks(); jest.useFakeTimers(); BrandAction.fetch.mockReturnValue({ type: "FETCH" }); });
afterEach(() => jest.useRealTimers());

test("debounces plain search text and keeps it during pagination", () => {
  const page = makePage();
  page.handleSearch({ target: { value: "ac" } });
  page.handleSearch({ target: { value: "acme" } });
  jest.advanceTimersByTime(300);
  expect(BrandAction.fetch).toHaveBeenCalledTimes(1);
  expect(BrandAction.fetch).toHaveBeenLastCalledWith(20, 0, "", "", "", "acme");
  page.handleTableChange({ current: 2, pageSize: 20 }, {}, {});
  expect(BrandAction.fetch).toHaveBeenLastCalledWith(20, 20, "", "", "", "acme");
});

test("sorting sends the API sort direction and resizing resets the page", () => {
  const page = makePage();
  page.handleTableChange({ current: 2, pageSize: 20 }, {}, { field: "name", order: "ascend" });
  expect(BrandAction.fetch).toHaveBeenLastCalledWith(20, 20, "name", "ASC", "", "");
  page.handleTableChange({ current: 2, pageSize: 50 }, {}, {});
  expect(BrandAction.fetch).toHaveBeenLastCalledWith(50, 0, "", "", "", "");
});

test("edit opens the shared form and delete targets only the chosen row", () => {
  const page = makePage();
  page.editBrand({ id: "42" });
  expect(page.props.history.push).toHaveBeenCalledWith("/settings/brands/42/edit");
  page.openDelete({ id: "42", name: "Acme" });
  expect(page.state.deleteIds).toEqual(["42"]);
  expect(page.state.deleteName).toBe("Acme");
});

test("delete errors retain the confirmation and selection with a useful error", async () => {
  const page = makePage();
  page.openDelete({ id: "42", name: "Acme" });
  BrandService.archive.mockRejectedValueOnce({ response: { data: { message: "Brand is in use." } } });
  await page.handleDelete();
  expect(page.state.deleteIds).toEqual(["42"]);
  expect(page.state.deleteError).toBe("Brand is in use.");
  expect(page.state.deleting).toBe(false);
});

test("successful bulk deletion resets pagination and refreshes the listing", async () => {
  const page = makePage();
  page.setState({ selectedRowKeys: ["1", "2"], current: 3 });
  page.openDelete();
  BrandService.archive.mockResolvedValueOnce({});
  await page.handleDelete();
  expect(BrandService.archive).toHaveBeenCalledWith(["1", "2"]);
  expect(page.state.deleteIds).toEqual([]);
  expect(page.state.selectedRowKeys).toEqual([]);
  expect(BrandAction.fetch).toHaveBeenCalledWith(20, 0, "", "", "", "");
});
