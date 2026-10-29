import React from "react";
import ReactDOMServer from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import CategoryService from "@services/CategoryService";
import CategoryAction from "./redux/action";
import { CategoryCreatePage } from "./form.create";

jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@services/CategoryService", () => ({ getById: jest.fn() }));

const makePage = () => {
  const fields = {};
  const page = new CategoryCreatePage({
    match: { params: { id: "42" } },
    form: {
      getFieldValue: name => fields[name],
      getFieldDecorator: (name, options = {}) => {
        fields[name] = options.initialValue;
        return element => element;
      },
      validateFieldsAndScroll: callback => callback(null, fields),
      setFields: jest.fn(), resetFields: jest.fn()
    },
    productsTypeAdd: {}, productsTypeUpdate: {},
    dispatch: jest.fn(), history: { push: jest.fn() }
  });
  page.setState = update => { page.state = { ...page.state, ...update }; };
  page.Util = { getAPIURL: () => "/api", getAccessToken: () => "", getProductImage: name => ({ url: `/images/${name}` }) };
  page.Enum = { IMAGE_SPACE: { CATEGORY: "category" } };
  page.getImageFromUpload = values => values.image.file.name || "";
  return { page, fields };
};
const render = page => ReactDOMServer.renderToStaticMarkup(<MemoryRouter>{page.render()}</MemoryRouter>);

afterEach(() => jest.restoreAllMocks());

test.each([
  ["direct category response", category => ({ data: category })],
  ["wrapped category response", category => ({ data: { data: category } })]
])("loads %s, preserves false/zero settings and submits an update with its id", async (_, response) => {
  const category = {
    id: 42, name: "Drinks", namekm: "Khmer name", namebm: "Burmese name", code: "DRK",
    parentId: 7, image: "drinks.png", description: "Keep cool", label: "Cold",
    status: 0, isFeature: false, isDefault: false, posQuickAccessEnabled: true,
    posColor: { name: "Blue", hex: "#2563eb" }, defaultMarginRule: { type: "GROSS_MARGIN", value: 0 }
  };
  CategoryService.getById.mockResolvedValue(response(category));
  const { page, fields } = makePage();
  await page.loadCategory();
  page.state.parentCategories = [category, { id: 7, name: "Food" }];
  const markup = render(page);
  expect(markup).toContain("Edit Category");
  expect(markup).toContain("Update Category");
  expect(fields).toMatchObject({ name: "Drinks", parentId: 7, status: 0, isFeature: false, defaultMarginValue: 0 });
  expect(fields.image.file.name).toBe("drinks.png");
  expect(page.state.selectedPosColor).toBe("#2563EB");
  const update = jest.spyOn(CategoryAction, "update").mockReturnValue({ type: "UPDATE" });
  const add = jest.spyOn(CategoryAction, "add");
  page.submitCategory("save");
  expect(update).toHaveBeenCalledWith({ ...category, posColor: { name: "Blue", hex: "#2563EB" } });
  expect(add).not.toHaveBeenCalled();
  expect(CategoryService.getById).toHaveBeenCalledWith("42");
});

test.each([null, {}, { data: null }, { data: {} }])("keeps missing or invalid category bodies in the error state: %p", async body => {
  const { page } = makePage();
  CategoryService.getById.mockResolvedValueOnce({ data: body });
  await page.loadCategory();
  expect(page.state.categoryError).toBe(true);
  expect(page.state.categoryLoading).toBe(false);
  expect(render(page)).toContain("Unable to load this category");
  page.submitCategory("save");
  expect(page.props.dispatch).not.toHaveBeenCalled();
});

test("blocks saving while loading or after failure and allows retry", async () => {
  const { page } = makePage();
  CategoryService.getById.mockRejectedValueOnce(new Error("Unavailable"));
  const pending = page.loadCategory();
  expect(render(page)).toContain("Loading category");
  page.submitCategory("save");
  await pending;
  expect(render(page)).toContain("Unable to load this category");
  page.submitCategory("save");
  expect(page.props.dispatch).not.toHaveBeenCalled();
  CategoryService.getById.mockResolvedValueOnce({ data: { data: { id: 42, name: "Drinks" } } });
  await page.loadCategory();
  expect(page.state.categoryError).toBe(false);
  expect(render(page)).toContain("Update Category");
});

test("update success returns to listing even if add-another was requested", () => {
  const { page } = makePage();
  page.state.saveMode = "addAnother";
  page.props.productsTypeUpdate = { updated: true };
  page.componentDidUpdate({ productsTypeUpdate: {} });
  expect(page.props.history.push).toHaveBeenCalledWith("/settings/categories");
  expect(page.props.form.resetFields).not.toHaveBeenCalled();
});

test("update duplicate-name errors use the existing field and banner behavior", () => {
  const { page } = makePage();
  page.state.category = { id: 42, name: "Drinks" };
  page.props.productsTypeUpdate = { error: { data: { error: { code: "CATEGORY_NAME_EXISTS", message: "Name already used" } } } };
  page.componentDidUpdate({ productsTypeUpdate: {} });
  expect(page.props.form.setFields).toHaveBeenCalled();
  expect(render(page)).toContain("Name already used");
});

test("an update rejection stays on the form and saving blocks duplicate submissions", async () => {
  const { page } = makePage();
  page.state.category = { id: 42, name: "Drinks" };
  render(page);
  jest.spyOn(CategoryAction, "update").mockReturnValue({ type: "UPDATE" });
  page.props.productsTypeUpdate = { updating: true };
  page.submitCategory("save");
  expect(page.props.dispatch).not.toHaveBeenCalled();
  page.props.productsTypeUpdate = {};
  page.props.dispatch.mockRejectedValueOnce(new Error("Unable to update"));
  page.submitCategory("save");
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(page.props.history.push).not.toHaveBeenCalled();
  expect(page.state.saveMode).toBe("save");
});
