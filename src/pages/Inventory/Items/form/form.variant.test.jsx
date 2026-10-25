import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Form } from "antd";
import FormVariant from "./form.variant";
import VariantService from "@services/VariantService";

jest.mock("@components/index", () => ({ InputText: require("../../../../components/InputText").InputText }), { virtual: true });
jest.mock("@components/UploadImageCrop", () => ({}), { virtual: true });
jest.mock("@layout/base-modal", () => require("react").Component, { virtual: true });
jest.mock("@model/index", () => require("../../../../model"), { virtual: true });
jest.mock("@redux/index", () => ({ Translate: () => null }), { virtual: true });
jest.mock("@enums/index", () => ({ ARCHIVE: 3 }), { virtual: true });
jest.mock("@services/VariantService", () => ({ checkIsAvailableForArchive: jest.fn() }));
jest.mock("../redux/action", () => ({}));

function setup() {
  const instance = new FormVariant({ callBackGetProductVariant: jest.fn(), handleCallBackGetArchiveProductVariant: jest.fn() });
  instance.Message = { error: jest.fn() };
  instance.Util = { getErrorMessageFromState: error => error?.data?.error?.message };
  instance.state.variants = [{ id: "variant-1", status: 1 }, { id: "variant-2", status: 1 }];
  instance.setState = (update, callback) => {
    instance.state = { ...instance.state, ...(typeof update === "function" ? update(instance.state) : update) };
    if (callback) callback();
  };
  return instance;
}

beforeEach(() => jest.resetAllMocks());

test.each([
  [{ response: { data: { error: { message: "This variant still has stock." } } } }, "This variant still has stock."],
  [{ response: { data: { message: "This variant is used by an order." } } }, "This variant is used by an order."],
  [{ data: { error: { message: "Variant cannot be deleted." } } }, "Variant cannot be deleted."],
  [new Error("Network Error"), "Unable to delete this variant. Please try again."],
  [{ response: { data: { error: { message: "  " } } } }, "Unable to delete this variant. Please try again."]
])("shows backend errors or a useful fallback and preserves the variant: %p", async (error, message) => {
  const instance = setup();
  const original = instance.state.variants;
  VariantService.checkIsAvailableForArchive.mockRejectedValue(error);

  await instance.onRemoveVariant(0, original[0]);

  expect(instance.Message.error).toHaveBeenCalledWith(message);
  expect(instance.state.variants).toBe(original);
  expect(original[0].status).toBe(1);
  expect(instance.props.callBackGetProductVariant).not.toHaveBeenCalled();
  expect(instance.props.handleCallBackGetArchiveProductVariant).not.toHaveBeenCalled();
  expect(instance.state.productVariantArchiveList).toEqual([]);
  expect(instance.state.deletingVariantId).toBeNull();
});

test("waits for backend approval before archiving and prevents repeat deletes while pending", async () => {
  const instance = setup();
  const record = instance.state.variants[0];
  let resolve;
  VariantService.checkIsAvailableForArchive.mockReturnValue(new Promise(done => { resolve = done; }));

  const pending = instance.onRemoveVariant(0, record);
  expect(instance.state.deletingVariantId).toBe(record.id);
  expect(instance.state.variants[0].status).toBe(1);
  await instance.onRemoveVariant(0, record);
  expect(VariantService.checkIsAvailableForArchive).toHaveBeenCalledTimes(1);

  resolve({ data: { status: true } });
  await pending;

  expect(instance.state.variants[0].status).toBe(3);
  expect(record.status).toBe(1);
  expect(instance.state.variants[1].status).toBe(1);
  expect(instance.props.callBackGetProductVariant).toHaveBeenCalledWith(instance.state.variants);
  expect(instance.props.handleCallBackGetArchiveProductVariant).toHaveBeenCalledWith([{ id: "variant-1", status: 3 }]);
  expect(instance.state.deletingVariantId).toBeNull();
});

test.each(["", 1720000000000])("removes an unsaved variant locally without calling the backend: %p", async id => {
  const instance = setup();
  const draft = { id, status: 1 };
  instance.state.variants.push(draft);

  await instance.onRemoveVariant(2, draft);

  expect(VariantService.checkIsAvailableForArchive).not.toHaveBeenCalled();
  expect(instance.state.variants).toHaveLength(2);
  expect(instance.props.callBackGetProductVariant).toHaveBeenCalledWith(instance.state.variants);
  expect(instance.props.handleCallBackGetArchiveProductVariant).not.toHaveBeenCalled();
});

test("keeps pending deletions across variant page changes", async () => {
  const instance = setup();
  VariantService.checkIsAvailableForArchive.mockResolvedValue({ data: { status: true } });
  await instance.onRemoveVariant(0, instance.state.variants[0]);

  instance.setState({ variants: [{ id: "variant-3", status: 1 }] });
  await instance.onRemoveVariant(0, instance.state.variants[0]);

  expect(instance.props.handleCallBackGetArchiveProductVariant).toHaveBeenLastCalledWith([
    { id: "variant-1", status: 3 },
    { id: "variant-3", status: 3 }
  ]);
});

test("adding a variant updates the parent collection used by save validation", () => {
  const instance = setup();
  instance.onAddNewVariant();
  expect(instance.state.variants).toHaveLength(3);
  expect(instance.props.callBackGetProductVariant).toHaveBeenCalledWith(instance.state.variants);
});

test.each([
  [1720000000000, ""],
  ["variant-1", "variant-1"]
])("variant ID fields validate with temporary and persisted table keys: %p", (id, expected) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const instance = setup();
  let form;
  const TestForm = Form.create()(({ form: currentForm }) => {
    form = currentForm;
    instance.props = { ...instance.props, form };
    return <Form>{instance.columns[1].render("", { id }, 0)}</Form>;
  });

  try {
    act(() => { ReactDOM.render(<TestForm />, container); });
    const onValidate = jest.fn();
    act(() => { form.validateFieldsAndScroll(onValidate); });
    expect(onValidate).toHaveBeenCalledWith(null, expect.objectContaining({ variantId: [expected] }));
  } finally {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  }
});
