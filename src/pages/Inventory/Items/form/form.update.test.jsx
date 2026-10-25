import { ItemFormUpdate } from "./form.update";
import ProductAction from "../redux/action";

jest.mock("@inventories/Option/FormCreate", () => () => null, { virtual: true });
jest.mock("@settings/Tax/FormCreate", () => () => null, { virtual: true });
jest.mock("@components/BaseComponent", () => require("react").Component, { virtual: true });
jest.mock("@router/index", () => ({}), { virtual: true });
jest.mock("@redux/index", () => ({ Translate: () => null }), { virtual: true });
jest.mock("@enums/index", () => ({ NO_VARIANT: 0, PRODUCT_VARIANT: 1, ARCHIVE: 3 }), { virtual: true });
jest.mock("./form.item", () => () => null);
jest.mock("./form.item.404", () => () => null);
jest.mock("../redux/action", () => ({ update: jest.fn(data => ({ type: "UPDATE", payload: data })) }));

function setup(values = {}) {
  const dispatch = jest.fn();
  const instance = new ItemFormUpdate({
    dispatch,
    form: {
      getFieldValue: jest.fn(),
      validateFieldsAndScroll: callback => callback(null, { productOption: 1, name: "Updated item", ...values })
    },
    productDetail: { data: { id: "item-1", productVariants: { data: [{ id: "variant-1" }] } } }
  });
  instance.Message = { error: jest.fn() };
  instance.CATranslate = key => key;
  instance.Util = { clearObjProperty: (object, keys) => keys.forEach(key => delete object[key]) };
  instance.getImageFromUpload = () => undefined;
  instance.setState = update => { instance.state = { ...instance.state, ...update }; };
  const submit = () => instance.onSubmit({ preventDefault: jest.fn() });
  return { instance, dispatch, submit };
}

beforeEach(() => jest.clearAllMocks());

test("saves item details without variant payload or collection errors when variants were never opened", () => {
  const { instance, dispatch, submit } = setup();
  submit();
  expect(instance.Message.error).not.toHaveBeenCalled();
  expect(dispatch).toHaveBeenCalledTimes(1);
  const payload = ProductAction.update.mock.calls[0][0];
  expect(payload).toMatchObject({ id: "item-1", name: "Updated item" });
  ["attributes", "productVariants", "productVariantId"].forEach(key => expect(payload).not.toHaveProperty(key));
});

test("sends edited variants after the editor initializes, including after it is collapsed", () => {
  const { instance, submit } = setup({ variantId: ["variant-1"], variantName: ["Small edited"], variantRetailPrice: [12] });
  instance.handleCallBackGetProductVariant([{ id: "variant-1" }]);
  instance.handleCallBackGetProductAttribute([{ id: "attribute-1" }]);
  submit();
  expect(ProductAction.update).toHaveBeenCalledWith(expect.objectContaining({
    attributes: [{ id: "attribute-1" }],
    productVariants: [expect.objectContaining({ id: "variant-1", name: "Small edited", price: 12 })]
  }));
});

test("still rejects an initialized variant collection with no variants", () => {
  const { instance, dispatch, submit } = setup();
  instance.handleCallBackGetProductVariant([]);
  submit();
  expect(instance.Message.error).toHaveBeenCalledWith("error_require_variant");
  expect(dispatch).not.toHaveBeenCalled();
});

test("saves new variants without a temporary ID while preserving existing variant IDs", () => {
  const { instance, submit } = setup({
    variantId: ["variant-1", ""],
    variantName: ["Existing", "New"],
    variantRetailPrice: [10, 15]
  });
  instance.handleCallBackGetProductVariant([{ id: "variant-1" }, { id: 1720000000000 }]);
  submit();

  const variants = ProductAction.update.mock.calls[0][0].productVariants;
  expect(variants[0]).toMatchObject({ id: "variant-1", name: "Existing", price: 10 });
  expect(variants[1]).toMatchObject({ name: "New", price: 15 });
  expect(variants[1]).not.toHaveProperty("id");
});

test("preserves the existing single-variant identifier for standard items", () => {
  const { instance, submit } = setup({ productOption: 0 });
  instance.props.productDetail.data.productVariants = [{ id: "standard-variant" }];
  submit();
  expect(ProductAction.update).toHaveBeenCalledWith(expect.objectContaining({ productVariantId: "standard-variant" }));
});

test("pending deletions override stale form status and are sent only once on save", () => {
  const { instance, submit, dispatch } = setup({
    variantId: ["variant-1", "variant-2"],
    variantName: ["Deleted", "Remaining"],
    variantRetailPrice: [5, 10],
    variantStatus: [1, 1]
  });
  instance.handleCallBackGetProductVariant([{ id: "variant-1", status: 3 }, { id: "variant-2", status: 1 }]);
  instance.handleCallBackGetArchiveProductVariant([{ id: "variant-1", status: 3 }]);
  expect(dispatch).not.toHaveBeenCalled();
  submit();

  expect(ProductAction.update.mock.calls[0][0].productVariants).toEqual([
    expect.objectContaining({ id: "variant-2", status: 1 }),
    { id: "variant-1", status: 3 }
  ]);
});

test("save includes archived rows that are no longer registered after changing pages", () => {
  const { instance, submit } = setup({ variantId: ["variant-2"], variantName: ["Remaining"], variantRetailPrice: [10] });
  instance.handleCallBackGetProductVariant([{ id: "variant-2" }]);
  instance.handleCallBackGetArchiveProductVariant([{ id: "variant-1", status: 3 }, { id: "variant-1", status: 3 }]);
  submit();

  expect(ProductAction.update.mock.calls[0][0].productVariants).toEqual([
    expect.objectContaining({ id: "variant-2" }),
    { id: "variant-1", status: 3 }
  ]);
});
