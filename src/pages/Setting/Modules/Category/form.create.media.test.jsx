import axios from "axios";
import { message } from "antd";
import { CategoryCreatePage, CategoryImageMedia } from "./form.create";

jest.mock("axios", () => Object.assign(jest.fn(), { post: jest.fn() }));
jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@services/CategoryService", () => ({}));
jest.mock("antd", () => ({
  Form: { create: () => component => component },
  Input: { TextArea: () => null },
  message: { error: jest.fn(), info: jest.fn() }
}));

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const photo = (name = "category.png", type = "image/png") => new File(["image"], name, { type });
const component = (props = {}) => {
  const media = new CategoryImageMedia({
    form: { setFieldsValue: jest.fn() },
    endpoint: "/api/files/upload/image",
    deleteEndpoint: "/api/category/delete",
    onBusyChange: jest.fn(),
    ...props
  });
  media.setState = update => { media.state = { ...media.state, ...update }; };
  return media;
};

const originalImage = global.Image;
const originalCreateUrl = URL.createObjectURL;
const originalRevokeUrl = URL.revokeObjectURL;

beforeEach(() => {
  jest.clearAllMocks();
  axios.mockReset();
  axios.post.mockReset();
  URL.createObjectURL = jest.fn(() => "blob:category-photo");
  URL.revokeObjectURL = jest.fn();
  global.Image = class {
    set src(value) {
      this.naturalWidth = 640;
      this.naturalHeight = 480;
      this.onload();
    }
  };
});

afterAll(() => {
  global.Image = originalImage;
  URL.createObjectURL = originalCreateUrl;
  URL.revokeObjectURL = originalRevokeUrl;
});

test("a successful upload retains original dimensions and the existing category save shape", async () => {
  axios.post.mockResolvedValue({ data: { filename: "stored.png" } });
  const media = component();
  await media.uploadFile(photo());
  const value = media.props.form.setFieldsValue.mock.calls[0][0].image;
  expect(value.file.name).toBe("stored.png");
  expect(value.dimensions).toEqual({ width: 640, height: 480 });
  expect(axios.post.mock.calls[0][0]).toBe("/api/files/upload/image");
  expect(axios.post.mock.calls[0][1].get("file").name).toBe("category.png");
  expect(axios.post.mock.calls[0][1].has("image")).toBe(false);
  expect(axios.post.mock.calls[0][2].headers["Content-Type"]).toBeUndefined();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:category-photo");
  expect(media.props.onBusyChange).toHaveBeenLastCalledWith(false);
});

test("images larger than 2 MB are uploaded without a client size restriction", async () => {
  axios.post.mockResolvedValue({ data: { filename: "large.png" } });
  const media = component();
  const large = photo("large.png");
  Object.defineProperty(large, "size", { value: 20 * 1024 * 1024 });
  await media.uploadFile(large);
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][1].get("file").name).toBe("large.png");
  expect(media.props.form.setFieldsValue).toHaveBeenCalled();
  expect(message.error).not.toHaveBeenCalled();
});

test("unsupported MIME types preserve the previous image", async () => {
  const media = component({ imageName: "previous.png" });
  await media.uploadFile(photo("disguised.png", "image/svg+xml"));
  expect(axios.post).not.toHaveBeenCalled();
  expect(media.props.form.setFieldsValue).not.toHaveBeenCalled();
  expect(message.error).toHaveBeenCalledWith("Choose a JPG, PNG, or GIF image.");
});

test("an unreadable image restores idle state without changing the selected image", async () => {
  global.Image = class { set src(value) { this.onerror(); } };
  const media = component({ imageName: "previous.png" });
  await media.uploadFile(photo());
  expect(axios.post).not.toHaveBeenCalled();
  expect(media.props.form.setFieldsValue).not.toHaveBeenCalled();
  expect(media.state.uploading).toBe(false);
  expect(media.props.onBusyChange).toHaveBeenLastCalledWith(false);
});

test("an older upload response cannot replace the newer selection", async () => {
  const first = deferred();
  const second = deferred();
  axios.post.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
  const media = component();
  const firstUpload = media.uploadFile(photo("first.png"));
  await Promise.resolve();
  const secondUpload = media.uploadFile(photo("second.png"));
  await Promise.resolve();
  second.resolve({ data: { filename: "second.png" } });
  await secondUpload;
  first.resolve({ data: { filename: "first.png" } });
  await firstUpload;
  expect(media.props.form.setFieldsValue).toHaveBeenCalledTimes(1);
  expect(media.props.form.setFieldsValue.mock.calls[0][0].image.file.name).toBe("second.png");
});

test("a failed replacement preserves the current form image and exposes the backend error", async () => {
  axios.post.mockRejectedValue({ response: { data: { message: "Image upload rejected" } } });
  const media = component({ imageName: "previous.png" });
  await media.uploadFile(photo());
  expect(media.props.form.setFieldsValue).not.toHaveBeenCalled();
  expect(message.error).toHaveBeenCalledWith("Image upload rejected");
  expect(media.props.onBusyChange).toHaveBeenLastCalledWith(false);
});

test("removal failures retain the current image", async () => {
  axios.mockRejectedValue(new Error("Unavailable"));
  const media = component({ imageName: "previous.png" });
  await media.handleRemoveImage();
  expect(media.props.form.setFieldsValue).not.toHaveBeenCalled();
  expect(media.state.deleting).toBe(false);
  expect(media.props.onBusyChange).toHaveBeenLastCalledWith(false);
});

test("successful removal clears the image using the existing category media delete contract", async () => {
  axios.mockResolvedValue({});
  const media = component({ imageName: "previous.png" });
  await media.handleRemoveImage();
  expect(axios.mock.calls[0][0]).toEqual(expect.objectContaining({
    method: "DELETE",
    url: "/api/category/delete",
    data: { fileName: "previous.png" }
  }));
  expect(media.props.form.setFieldsValue).toHaveBeenCalledWith({ image: null });
  expect(media.props.onBusyChange).toHaveBeenLastCalledWith(false);
});

test("a removal response cannot change the form after the media section unmounts", async () => {
  const removal = deferred();
  axios.mockReturnValue(removal.promise);
  const media = component({ imageName: "previous.png" });
  const pending = media.handleRemoveImage();
  media.componentWillUnmount();
  removal.resolve({});
  await pending;
  expect(media.props.form.setFieldsValue).not.toHaveBeenCalled();
});

test("the save handler waits for pending media work, including keyboard submission", () => {
  const page = new CategoryCreatePage({ productsTypeAdd: {}, form: { validateFieldsAndScroll: jest.fn() } });
  page.state.mediaBusy = true;
  page.submitCategory("save");
  expect(page.props.form.validateFieldsAndScroll).not.toHaveBeenCalled();
  expect(message.info).toHaveBeenCalled();
});
