import React from "react";
import ReactDOM from "react-dom";
import { act, findRenderedComponentWithType } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import axios from "axios";
import CategoryForm, { CategoryCreatePage, CategoryImageMedia } from "./form.create";

jest.mock("@components/BaseComponent", () => {
  const React = require("react");
  return class extends React.Component {
    Util = {
      getAPIURL: () => process.env.CATEGORY_UPLOAD_SIM_URL,
      getAccessToken: () => "fixture-token",
      getProductImage: name => ({ url: `/legacy/category/${name}` })
    };
    Enum = { IMAGE_SPACE: { CATEGORY: "category" } };
    getImageFromUpload = values => values.image && values.image.file.name;
  };
}, { virtual: true });
jest.mock("@services/CategoryService", () => ({ get: () => Promise.resolve({ data: { data: [] } }) }));
jest.mock("./redux/action", () => ({ reset: () => ({ type: "RESET" }), add: payload => ({ type: "ADD", payload }) }));

const httpTest = process.env.CATEGORY_UPLOAD_SIM_URL ? test : test.skip;
describe("category photo with a real form and HTTP upload", () => {
  let container;
  let originalImage;
  let originalCreate;
  let originalRevoke;
  let store;
  let saved;
  let originalResourceHost;
  beforeEach(() => {
    originalResourceHost = process.env.REACT_APP_RESOURCE_HOST;
    process.env.REACT_APP_RESOURCE_HOST = process.env.CATEGORY_UPLOAD_SIM_URL ? process.env.CATEGORY_UPLOAD_SIM_URL.replace(/\/uploads$/, "") : "https://resources.example.com";
    container = document.createElement("div");
    document.body.appendChild(container);
    originalImage = global.Image;
    originalCreate = URL.createObjectURL;
    originalRevoke = URL.revokeObjectURL;
    URL.createObjectURL = () => "blob:fixture-photo";
    URL.revokeObjectURL = () => {};
    // jsdom does not decode image pixels; HTTP and form rendering remain real.
    global.Image = class { set src(value) { this.naturalWidth = 1; this.naturalHeight = 1; this.onload(); } };
    store = createStore((state = { reducer: { productsType: { add: {}, update: {} } }, locale: {} }, action) => {
      if (action.type === "ADD") saved = action.payload;
      return state;
    });
  });
  afterEach(() => {
    act(() => ReactDOM.unmountComponentAtNode(container));
    container.remove();
    if (originalResourceHost === undefined) delete process.env.REACT_APP_RESOURCE_HOST;
    else process.env.REACT_APP_RESOURCE_HOST = originalResourceHost;
    global.Image = originalImage;
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  });

  test("a mounted connected form refreshes its thumbnail and photo preview from the stored key", async () => {
    let root;
    await act(async () => {
      root = ReactDOM.render(<Provider store={store}><MemoryRouter><CategoryForm history={{ push: jest.fn() }} /></MemoryRouter></Provider>, container);
    });
    const page = findRenderedComponentWithType(root, CategoryCreatePage);
    const key = "fixture-tenant/image/stored.png";
    act(() => page.props.form.setFieldsValue({ image: { file: { name: key, status: "done" } } }));
    const url = `${process.env.REACT_APP_RESOURCE_HOST}/public/temp_uploads/${key}`;
    expect(container.querySelector('.category-create-thumbnail img').getAttribute("src")).toBe(url);
    act(() => page.handleDisplayModeChange("photo"));
    expect(container.querySelector('.category-create-preview-tile img').getAttribute("src")).toBe(url);
    act(() => page.props.form.setFieldsValue({ image: null }));
    expect(container.querySelector('.category-create-thumbnail img')).toBeNull();
  });

  httpTest("uses the stored key for saving and the returned URL for thumbnail and POS preview", async () => {
    let root;
    await act(async () => {
      root = ReactDOM.render(<Provider store={store}><MemoryRouter><CategoryForm history={{ push: jest.fn() }} /></MemoryRouter></Provider>, container);
    });
    const page = findRenderedComponentWithType(root, CategoryCreatePage);
    const media = findRenderedComponentWithType(root, CategoryImageMedia);
    const file = new File(["fixture-image"], "original.png", { type: "image/png" });
    await act(async () => { await media.uploadFile(file); });
    const key = "fixture-tenant/image/e07cc3533f60a1286679807faae6eaa6.png";
    const url = `${process.env.REACT_APP_RESOURCE_HOST}/public/temp_uploads/${key}`;
    expect(page.props.form.getFieldValue("image").file.name).toBe(key);
    expect(container.querySelector('.category-create-thumbnail img').getAttribute("src")).toBe(url);
    act(() => page.handleDisplayModeChange("photo"));
    expect(container.querySelector('.category-create-preview-tile img').getAttribute("src")).toBe(url);
    const image = await axios.get(`${process.env.CATEGORY_UPLOAD_SIM_URL}/public/temp_uploads/${key}`, { responseType: "arraybuffer" });
    expect(image.headers["content-type"]).toBe("image/png");
    act(() => { page.props.form.setFieldsValue({ name: "Photo category" }); });
    await act(async () => { page.submitCategory("save"); });
    expect(saved.image).toBe(key);
    expect(media.props.deleteEndpoint).toBe(`${process.env.CATEGORY_UPLOAD_SIM_URL}/files/delete/image/${key.split("/").pop()}`);
    await act(async () => { await media.handleRemoveImage(); });
    expect(page.props.form.getFieldValue("image")).toBeNull();
    expect(container.querySelector('.category-create-thumbnail img')).toBeNull();
  });
});
