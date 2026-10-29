import CategoryPage from "./index";
import CategoryAction from "../redux/action";

jest.mock("@layout/datatable", () => require("react").Component, { virtual: true });
jest.mock("@services/CategoryService", () => ({}), { virtual: true });
jest.mock("@enums/index", () => ({ LOCAL_SCHEMA: { PRODUCT_TYPE: "categories" } }), { virtual: true });
jest.mock("@redux/index", () => ({ Translate: () => null }), { virtual: true });
jest.mock("../form.update", () => () => null);
jest.mock("../redux/action", () => ({ fetch: jest.fn() }));

const makePage = () => {
  const page = new CategoryPage({ dispatch: jest.fn(), categories: { pagination: { limit: 20 } } });
  page.fetchingProp = "categories";
  page.setState = update => { page.state = { ...page.state, ...update }; };
  page.fetchCategorySummary = jest.fn();
  return page;
};

beforeEach(() => {
  jest.useFakeTimers();
  CategoryAction.fetch.mockReset();
  CategoryAction.fetch.mockReturnValue({ type: "FETCH_CATEGORIES" });
});

afterEach(() => jest.useRealTimers());

test("debounces category search and sends the plain text", () => {
  const page = makePage();
  page.onSearch({ target: { value: "dri" } });
  page.onSearch({ target: { value: "drink" } });
  expect(CategoryAction.fetch).not.toHaveBeenCalled();

  jest.advanceTimersByTime(300);

  expect(CategoryAction.fetch).toHaveBeenCalledTimes(1);
  expect(CategoryAction.fetch).toHaveBeenCalledWith(20, 0, "", "", "", "drink");
  expect(page.props.dispatch).toHaveBeenCalledWith({ type: "FETCH_CATEGORIES" });
  expect(page.state.current).toBe(1);
});

test("clearing search requests an unfiltered list", () => {
  const page = makePage();
  page.onSearch({ target: { value: "" } });
  jest.advanceTimersByTime(300);
  expect(CategoryAction.fetch).toHaveBeenCalledWith(20, 0, "", "", "", "");
});

test("refresh preserves the plain search text and cancels a pending search", () => {
  const page = makePage();
  page.state.current = 2;
  page.onSearch({ target: { value: "drink" } });
  page.handleRefresh();
  jest.advanceTimersByTime(300);
  expect(CategoryAction.fetch).toHaveBeenCalledTimes(1);
  expect(CategoryAction.fetch).toHaveBeenCalledWith(20, 20, "", "", "", "drink");
  expect(page.fetchCategorySummary).toHaveBeenCalledTimes(1);
});

test("editing a category opens the shared category form", () => {
  const page = makePage();
  page.props.history = { push: jest.fn() };
  page.handleShowFormEdit({ id: 42 });
  expect(page.props.history.push).toHaveBeenCalledWith("/settings/categories/42/edit");
});
