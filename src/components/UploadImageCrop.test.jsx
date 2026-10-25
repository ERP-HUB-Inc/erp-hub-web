import axios from "axios";
import { message } from "antd";
import { UploadImageCrop } from "./UploadImageCrop";

jest.mock("axios", () => {
  const client = jest.fn();
  client.post = jest.fn();
  return client;
});

jest.mock("antd", () => ({
  Button: () => null, Form: { Item: () => null }, Modal: () => null,
  Upload: () => null, message: { error: jest.fn() }
}));
jest.mock("react-localize-redux", () => ({ Translate: () => null }));

const makeComponent = (props = {}) => {
  const component = new UploadImageCrop({
    fileList: [], name: "image", form: { setFieldsValue: jest.fn() },
    accessToken: "fixture-token", ...props
  });
  component.setState = (update, callback) => {
    component.state = { ...component.state, ...update };
    if (callback) callback();
  };
  component.imageRef = { width: 400, height: 200, naturalWidth: 1600, naturalHeight: 800 };
  component.context = { drawImage: jest.fn() };
  component.canvasPreviewRef = {
    getContext: () => component.context,
    toDataURL: () => "data:image/png;base64,aW1hZ2U="
  };
  component.state.cropFile = { uid: "selected", name: "photo.jpg" };
  return component;
};

beforeEach(() => jest.clearAllMocks());

test.each([[400, 200], [100, 300], [80, 80]])("initial crop fits a %s by %s image and exports a square", (width, height) => {
  const component = makeComponent();
  Object.assign(component.imageRef, { width, height, naturalWidth: width * 4, naturalHeight: height * 4 });
  component.handleImageLoad({ currentTarget: component.imageRef });
  const crop = component.state.crop;
  expect(crop.x).toBeGreaterThanOrEqual(0);
  expect(crop.y).toBeGreaterThanOrEqual(0);
  expect(crop.x + crop.width).toBeLessThanOrEqual(100);
  expect(crop.y + crop.height).toBeLessThanOrEqual(100);
  expect(component.canvasPreviewRef.width).toBe(Math.min(width, height) * 4);
  expect(component.canvasPreviewRef.height).toBe(component.canvasPreviewRef.width);
  expect(component.state.blobImg.type).toBe("image/png");
});

test("pixel crop exports the selected source rectangle without screen-density upscaling", () => {
  const component = makeComponent();
  const previousRatio = window.devicePixelRatio;
  window.devicePixelRatio = 3;
  component.handleCroppedImage({ unit: "px", x: 10, y: 20, width: 80, height: 80 });
  expect(component.context.drawImage).toHaveBeenCalledWith(component.imageRef, 40, 80, 320, 320, 0, 0, 320, 320);
  expect(component.canvasPreviewRef.width).toBe(320);
  window.devicePixelRatio = previousRatio;
});

test("unloaded or empty crops clear the previous blob", () => {
  const component = makeComponent();
  component.state.blobImg = new Blob(["old"]);
  component.handleCroppedImage({ x: 0, y: 0, width: 0, height: 0 });
  expect(component.state.blobImg).toBeNull();
  component.imageRef = null;
  expect(() => component.handleCroppedImage({ width: 80, height: 80 })).not.toThrow();
});

test("oversized crops keep the canvas available so the user can select a smaller area", () => {
  const component = makeComponent();
  const file = component.state.cropFile;
  component.generateCropImage({ unit: "px", x: 0, y: 0, width: 80, height: 80 }, file, 0);
  expect(component.state.blobImg).toBeNull();
  expect(component.state.cropFile).toBe(file);
  expect(message.error).toHaveBeenCalled();
  component.handleCroppedImage({ unit: "px", x: 0, y: 0, width: 40, height: 40 });
  expect(component.state.blobImg).not.toBeNull();
});

test("selection resets old crop data and waits for image loading", async () => {
  const component = makeComponent();
  component.handleImageLoad({ currentTarget: component.imageRef });
  const file = { uid: "next", name: "next.png", url: "data:image/png;base64,aW1hZ2U=" };
  await component.handleChange({ file, fileList: [file] });
  expect(component.state.visible).toBe(true);
  expect(component.state.crop).toBeNull();
  expect(component.state.blobImg).toBeNull();
  component.handleCancel();
  expect(component.state.visible).toBe(false);
  expect(component.props.form.setFieldsValue).toHaveBeenCalledWith({ image: null });
});

test("removed files do not reopen the crop dialog", async () => {
  const component = makeComponent();
  await component.handleChange({ file: { status: "removed" }, fileList: [] });
  expect(component.state.visible).toBe(false);
});

test.each([false, true])("reads a browsed File with wrapped fileList=%p", async wrapped => {
  const component = makeComponent();
  const file = new File(["image"], "photo.png", { type: "image/png" });
  file.uid = "browsed";
  const entry = wrapped
    ? { uid: file.uid, name: file.name, type: file.type, originFileObj: file }
    : file;

  await component.handleChange({ file, fileList: [entry] });

  expect(message.error).not.toHaveBeenCalled();
  expect(component.state.visible).toBe(true);
  expect(component.state.previewImage).toBe("data:image/png;base64,aW1hZ2U=");
  expect(component.state.cropFile.name).toBe("photo.png");
});

describe("image upload state", () => {
  const base = "/fixture";
  const ready = () => {
    const component = makeComponent({
      endPoint: `${base}/files/upload/item`, endPointDelete: `${base}/files/delete/item`,
      responseAfterUpload: jest.fn()
    });
    component.state.visible = true;
    component.handleImageLoad({ currentTarget: component.imageRef });
    return component;
  };

  test("uploads PNG, updates form and callback, then deletes the saved filename", async () => {
    axios.post.mockResolvedValue({ data: { status: "success", filename: "photo.png" } });
    axios.mockResolvedValue({ data: { status: "success" } });
    const component = ready();
    const pending = component.handleUpload({ preventDefault: jest.fn() });
    expect(component.state.uploading).toBe(true);
    expect(axios.post.mock.calls[0][1].get("file").name).toBe("photo.png");
    expect(axios.post.mock.calls[0][1].get("file").type).toBe("image/png");
    component.handleCancel();
    expect(component.state.visible).toBe(true);
    await pending;
    expect(message.error).not.toHaveBeenCalled();
    expect(component.state.visible).toBe(false);
    expect(component.state.fileList[0]).toMatchObject({ name: "photo.png", status: "done" });
    expect(component.props.form.setFieldsValue).toHaveBeenCalledWith({
      image: { file: component.state.fileList[0], fileList: component.state.fileList }
    });
    expect(component.props.responseAfterUpload).toHaveBeenCalledTimes(1);
    await component.handleRemove(component.state.fileList[0]);
    expect(component.state.fileList).toEqual([]);
    expect(component.props.form.setFieldsValue).toHaveBeenLastCalledWith({ image: null });
  });

  test("failed upload retains the crop for retry and leaves the saved image unchanged", async () => {
    const component = ready();
    axios.post.mockRejectedValue(new Error("Upload failed"));
    await component.handleUpload({ preventDefault: jest.fn() });
    expect(component.state.visible).toBe(true);
    expect(component.state.uploading).toBe(false);
    expect(component.state.blobImg).not.toBeNull();
    expect(component.state.fileList).toEqual([]);
    expect(component.props.responseAfterUpload).not.toHaveBeenCalled();
    expect(component.props.form.setFieldsValue).not.toHaveBeenCalled();
    expect(message.error).toHaveBeenCalled();
  });

  test("failed deletion retains the saved image and form value", async () => {
    const component = ready();
    axios.mockRejectedValue(new Error("Delete failed"));
    const file = { name: "photo.png", status: "done" };
    component.state.fileList = [file];
    expect(await component.handleRemove(file)).toBe(false);
    expect(component.state.fileList).toEqual([file]);
    expect(component.props.form.setFieldsValue).not.toHaveBeenCalled();
    expect(message.error).toHaveBeenCalled();
  });
});
