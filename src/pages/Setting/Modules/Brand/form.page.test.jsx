import BrandService from "@services/BrandService";
import BrandAction from "./redux/action";
import { BrandFormPage } from "./form.page";

jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@services/BrandService", () => ({ getById: jest.fn() }));
jest.mock("../Category/form.create", () => ({ CategoryImageMedia: () => null }));

const makePage = (id, values = { name: " Brand ", description: "Details", status: 0, image: { file: { name: "tenant/image/stored.png" } } }) => {
  const page = new BrandFormPage({
    match: { params: id ? { id } : {} }, history: { push: jest.fn() }, dispatch: jest.fn(), brandAdd: {}, brandUpdate: {},
    form: { validateFieldsAndScroll: callback => callback(null, values), getFieldValue: key => values[key], isFieldsTouched: () => false }
  });
  page.getImageFromUpload = fields => fields.image.file.name;
  page.setState = next => { page.state = { ...page.state, ...next }; };
  return page;
};
afterEach(() => jest.restoreAllMocks());

test("creates with supported brand fields and stored image key", () => {
  const add = jest.spyOn(BrandAction, "add").mockReturnValue({ type: "ADD" });
  makePage().handleSubmit();
  expect(add).toHaveBeenCalledWith({ name: "Brand", description: "Details", status: 0, image: "tenant/image/stored.png" });
});

test.each([brand => ({ data: brand }), brand => ({ data: { data: brand } })])("loads direct and wrapped detail shapes and updates the saved brand without activating it", async response => {
  const page = makePage("42");
  BrandService.getById.mockResolvedValueOnce(response({ id: "42", name: "Brand", status: 0 }));
  await page.loadBrand();
  const update = jest.spyOn(BrandAction, "update").mockReturnValue({ type: "UPDATE" });
  page.handleSubmit();
  expect(BrandService.getById).toHaveBeenCalledWith("42");
  expect(update).toHaveBeenCalledWith({ id: "42", name: "Brand", description: "Details", status: 0, image: "tenant/image/stored.png" });
});

test("failed detail load blocks submission and a successful retry clears the error", async () => {
  const page = makePage("42");
  BrandService.getById.mockRejectedValueOnce(new Error("Unavailable"));
  await page.loadBrand();
  expect(page.state.loadError).toBe(true);
  page.handleSubmit();
  expect(page.props.dispatch).not.toHaveBeenCalled();
  BrandService.getById.mockResolvedValueOnce({ data: { data: { id: "42" } } });
  await page.loadBrand();
  expect(page.state.loadError).toBe(false);
  expect(page.state.brand.id).toBe("42");
});

test("blocks submission during upload and after validation errors", () => {
  const page = makePage();
  const add = jest.spyOn(BrandAction, "add");
  page.state.mediaBusy = true;
  page.handleSubmit();
  page.state.mediaBusy = false;
  page.props.form.validateFieldsAndScroll = callback => callback({ name: "Required" });
  page.handleSubmit();
  expect(add).not.toHaveBeenCalled();
  expect(page.props.dispatch).not.toHaveBeenCalled();
});

test("successful update returns to the brands listing", () => {
  const page = makePage("42");
  page.props.brandUpdate = { updated: true };
  page.componentDidUpdate({ brandUpdate: {} });
  expect(page.props.history.push).toHaveBeenCalledWith("/settings/brands");
});

test("a rejected save remains on the form", async () => {
  const page = makePage();
  jest.spyOn(BrandAction, "add").mockReturnValue({ type: "ADD" });
  page.props.dispatch.mockRejectedValueOnce(new Error("Unavailable"));
  page.handleSubmit();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(page.props.history.push).not.toHaveBeenCalled();
});
