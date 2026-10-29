import React from "react";
import ReactDOMServer from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise-middleware";
import productsTypeReducer from "../../../../app/modules/inventory/reducers/products/productsType";
import CategoryService from "@services/CategoryService";
import CategoryAction from "./redux/action";
import { CategoryCreatePage } from "./form.create";

jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@services/CategoryService", () => ({ add: jest.fn() }));

const makePage = () => {
  const page = new CategoryCreatePage({
    form: {
      getFieldValue: name => name === "name" ? "Dairy & Frozen Goods" : undefined,
      getFieldDecorator: () => element => element,
      setFields: jest.fn(),
      validateFieldsAndScroll: callback => callback(null, { name: "Dairy & Frozen Goods", image: { file: {} } })
    },
    productsTypeAdd: {},
    dispatch: jest.fn()
  });
  page.Util = { getAPIURL: () => "/api", getAccessToken: () => "" };
  page.Enum = { IMAGE_SPACE: { CATEGORY: "category" } };
  page.getImageFromUpload = () => "";
  page.setState = update => { page.state = { ...page.state, ...update }; };
  return page;
};

let container;
const renderPage = page => {
  container.innerHTML = ReactDOMServer.renderToStaticMarkup(<MemoryRouter>{page.render()}</MemoryRouter>);
  return container;
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  container.remove();
  jest.restoreAllMocks();
});

test("renders the eight choices without treating a reference icon or unavailable settings as saved values", () => {
  const node = renderPage(makePage());
  const icons = Array.from(node.querySelectorAll('.category-create-icon-grid [role="radio"]'));
  expect(icons.map(icon => icon.textContent)).toEqual(["Frozen", "Bag", "Beverage", "Dairy", "Packs", "Electric", "Health", "Promo"]);
  expect(icons.every(icon => icon.getAttribute("aria-checked") === "false")).toBe(true);
  expect(icons.filter(icon => icon.tabIndex === 0)).toHaveLength(1);
  expect(node.querySelector('[aria-label="Pin to Quick Ribbon"]').disabled).toBe(false);
  expect(node.querySelector("#category-touch-sound")).toBeNull();
  expect(node.textContent).not.toContain("Touch Sound Profile");
  expect(node.textContent).not.toContain("80Hz");
});

test("selecting Frozen updates the icon radio state and the live preview", () => {
  const page = makePage();
  page.handleSelectPosIcon("frozen");
  const node = renderPage(page);
  expect(node.querySelector('[role="radio"][aria-checked="true"]').textContent).toBe("Frozen");
  expect(node.querySelector(".category-create-preview-icon .lucide-ice-cream-cone")).not.toBeNull();
});

test("radio arrow navigation wraps and moves keyboard focus", () => {
  const page = makePage();
  const node = renderPage(page);
  const first = node.querySelector('.category-create-icon-grid [role="radio"]');
  const event = { key: "ArrowLeft", currentTarget: first, preventDefault: jest.fn() };
  page.handlePosIconKeyDown(event, 0);
  expect(page.state.selectedPosIcon).toBe("promo");
  expect(document.activeElement.textContent).toBe("Promo");
  expect(event.preventDefault).toHaveBeenCalled();
});

test("a custom hex value updates the dot and preview without selecting a preset", () => {
  const page = makePage();
  page.handleCustomPosColorChange({ target: { value: " #aabbcc " } });
  const node = renderPage(page);
  expect(node.querySelector('[aria-label="Custom POS color hex"]').value).toBe("#AABBCC");
  expect(node.querySelector('[aria-label="Choose custom POS tile color"]').value).toBe("#aabbcc");
  expect(node.querySelector('.category-create-color-swatch[aria-pressed="true"]')).toBeNull();
  expect(node.querySelector(".category-create-preview-tile").getAttribute("style")).toContain("#AABBCC");
});

test("invalid hex input retains the last valid preview color and exposes an inline error", () => {
  const page = makePage();
  page.handleCustomPosColorChange({ target: { value: "#INVALID" } });
  const node = renderPage(page);
  expect(page.state.selectedPosColor).toBe("#059669");
  expect(node.querySelector('[aria-label="Custom POS color hex"]').getAttribute("aria-invalid")).toBe("true");
  expect(node.querySelector("#category-pos-color-error").textContent).toContain("6-digit hex");
});

test("zero priority remains visible and icon/priority drafts survive both display modes", () => {
  const page = makePage();
  page.handleSelectPosIcon("dairy");
  page.handleDisplayPriorityChange({ target: { value: "0" } });
  page.handleDisplayModeChange("photo");
  expect(renderPage(page).querySelector(".category-create-preview-priority.is-photo").textContent).toBe("#0");
  page.handleDisplayModeChange("icon");
  const node = renderPage(page);
  expect(node.querySelector(".category-create-preview-priority.is-icon").textContent).toBe("#0");
  expect(node.querySelector(".category-create-preview-icon .lucide-milk")).not.toBeNull();
});

test("fractional and out-of-range numeric drafts display errors without silently changing the input", () => {
  const page = makePage();
  ["1.5", "9007199254740992"].forEach(value => {
    page.handleDisplayPriorityChange({ target: { value } });
    const node = renderPage(page);
    expect(node.querySelector("#category-display-priority").value).toBe(value);
    expect(node.querySelector("#category-display-priority").getAttribute("aria-invalid")).toBe("true");
    expect(node.querySelector("#category-display-priority-error")).not.toBeNull();
  });
});

test("sends the selected color while excluding unconfirmed preview fields", () => {
  const page = makePage();
  const add = jest.spyOn(CategoryAction, "add").mockReturnValue({ type: "SAVE_CATEGORY" });
  page.handleSelectPosIcon("frozen");
  page.handleDisplayPriorityChange({ target: { value: "12" } });
  page.handleSelectPosColor("#2563EB");
  page.submitCategory("save");
  expect(add).toHaveBeenCalledWith({
    name: "Dairy & Frozen Goods", namekm: "", namebm: "", code: "", parentId: null, image: "", description: "", label: "",
    status: 1, isDefault: false, isFeature: false, posQuickAccessEnabled: false,
    posColor: { name: "Blue", hex: "#2563EB" }
  });
});

test("an invalid custom color blocks saving rather than sending the previous color", () => {
  const page = makePage();
  page.handleCustomPosColorChange({ target: { value: "invalid" } });
  page.submitCategory("save");
  expect(page.props.dispatch).not.toHaveBeenCalled();
});

test.each([
  body => ({ data: body }),
  body => ({ response: { data: body } }),
  body => body
])("maps duplicate-name errors to the name field and shows the backend message", wrap => {
  const page = makePage();
  page.props.productsTypeAdd.error = wrap({ error: { code: "CATEGORY_NAME_EXISTS", message: "This category name is already in use." } });
  page.componentDidUpdate({ productsTypeAdd: {} });
  expect(page.props.form.setFields).toHaveBeenCalledWith({
    name: { value: "Dairy & Frozen Goods", errors: [new Error("This category name is already in use.")] }
  });
  expect(renderPage(page).querySelector(".category-create-api-error").textContent).toContain("This category name is already in use.");
  page.componentDidUpdate(page.props);
  expect(page.props.form.setFields).toHaveBeenCalledTimes(1);
});

test("a duplicate code without a message uses the actionable fallback", () => {
  const page = makePage();
  page.props.productsTypeAdd.error = { data: { error: { code: "CATEGORY_NAME_EXISTS" } } };
  page.componentDidUpdate({ productsTypeAdd: {} });
  expect(page.props.form.setFields.mock.calls[0][0].name.errors[0].message).toBe("This category name is already in use.");
});

test("changing a duplicate name clears the stale API error through the existing reset action", () => {
  const page = makePage();
  page.props.productsTypeAdd.error = { data: { error: { code: "CATEGORY_NAME_EXISTS" } } };
  const reset = jest.spyOn(CategoryAction, "reset").mockReturnValue({ type: "RESET_CATEGORY" });
  page.handleNameChange();
  expect(reset).toHaveBeenCalled();
  expect(page.props.dispatch).toHaveBeenCalledWith({ type: "RESET_CATEGORY" });
});

test("unrelated API errors remain visible without setting a name error or resetting on edits", () => {
  const page = makePage();
  page.props.productsTypeAdd.error = { data: { error: { code: "FORBIDDEN", message: "Permission denied." } } };
  page.componentDidUpdate({ productsTypeAdd: {} });
  page.handleNameChange();
  expect(page.props.form.setFields).not.toHaveBeenCalled();
  expect(page.props.dispatch).not.toHaveBeenCalled();
  expect(renderPage(page).querySelector(".category-create-api-error").textContent).toContain("Permission denied.");
});

test("handles the middleware's rejected create promise while retaining the 409 error for the form", async () => {
  const error = Object.assign(new Error("Request failed with status code 409"), {
    response: { status: 409, data: { error: { code: "CATEGORY_NAME_EXISTS", message: "This category name is already in use." } } }
  });
  CategoryService.add.mockRejectedValueOnce(error);
  const store = createStore(productsTypeReducer, applyMiddleware(thunk, promiseMiddleware()));
  const page = makePage();
  page.props.dispatch.mockImplementation(store.dispatch);

  page.submitCategory("addAnother");

  // Let the middleware and submit handler finish processing the rejection.
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(store.getState().add).toMatchObject({ adding: false, added: false, error: error.response });
  expect(page.state.saveMode).toBe("save");
  page.props.productsTypeAdd = store.getState().add;
  page.componentDidUpdate({ productsTypeAdd: {} });
  expect(page.props.form.setFields.mock.calls[0][0].name.errors[0].message).toBe("This category name is already in use.");
  expect(renderPage(page).querySelector(".category-create-api-error").textContent).toContain("This category name is already in use.");
});
