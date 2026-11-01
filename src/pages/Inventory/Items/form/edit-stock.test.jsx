import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import EditStock from "./edit-stock";
import LocationService from "@services/LocationService";
import StockAdjustmentService from "@services/StockAdjustmentService";

jest.mock("@redux/index", () => ({
  Translate: ({ id }) => <span>{id}</span>,
  getActiveLanguage: () => ({ code: "en" })
}), { virtual: true });
jest.mock("@services/LocationService", () => ({ get: jest.fn() }));
jest.mock("@services/StockAdjustmentService", () => ({ add: jest.fn() }));

let container, drawer, callback;
const product = {
  id: "item-1", name: "T-shirt", stockUnit: { id: 3, name: "pcs" },
  productVariants: [{ id: "first-variant", name: "Small", barcode: "111" }]
};
const selectedVariant = { id: "second-variant", name: "Large / Blue", barcode: "222" };

beforeEach(async () => {
  LocationService.get.mockResolvedValue({ data: { data: [{ id: 7, name: "Shop", isDefault: 1 }] } });
  StockAdjustmentService.add.mockResolvedValue({ data: { id: "adjustment-1" } });
  callback = jest.fn();
  container = document.createElement("div");
  document.body.appendChild(container);
  await act(async () => {
    ReactDOM.render(<EditStock ref={value => { drawer = value; }} locale={{ languages: [{ code: "en" }], translations: {} }} callback={callback} />, container);
  });
});
afterEach(() => {
  act(() => ReactDOM.unmountComponentAtNode(container));
  container.remove();
  jest.resetAllMocks();
});

test("shows the parent item and selected variant and posts the selected variant instead of the first", async () => {
  act(() => drawer.showDrawer(product, selectedVariant));
  const context = document.querySelector('.item-stock-edit-context');
  expect(context.textContent).toContain("T-shirt");
  expect(context.textContent).toContain("Large / Blue");
  expect(context.textContent).toContain("222");
  act(() => drawer.setState({ reason: "Stock count", adjustQuantity: 12.5 }));
  await act(async () => { await drawer.onSubmit({ preventDefault: jest.fn() }); });
  expect(StockAdjustmentService.add).toHaveBeenCalledWith({
    reason: "Stock count", locationId: 7, status: 1,
    entries: [{ variantId: "second-variant", itemName: "T-shirt", variantName: "Large / Blue", barcode: "222", unitId: 3, adjustQuantity: 12.5 }]
  });
  expect(callback).toHaveBeenCalledTimes(1);
  expect(drawer.state.visible).toBe(false);
});

test("keeps the existing parent entry point working and clears values when switching variants", () => {
  act(() => drawer.showDrawer(product));
  expect(drawer.state.variant.id).toBe("first-variant");
  act(() => drawer.setState({ reason: "Previous count", adjustQuantity: 40 }));
  act(() => drawer.showDrawer(product, selectedVariant));
  expect(drawer.state.reason).toBe("");
  expect(drawer.state.adjustQuantity).toBe(0);
  expect(drawer.state.variant.id).toBe("second-variant");
});

test("keeps the drawer open with the backend error and does not refresh after failure", async () => {
  StockAdjustmentService.add.mockRejectedValue({ response: { data: { message: "Quantity is below reserved stock." } } });
  act(() => drawer.showDrawer(product, selectedVariant));
  await act(async () => { await drawer.onSubmit({ preventDefault: jest.fn() }); });
  expect(drawer.state.visible).toBe(true);
  expect(drawer.state.submitting).toBe(false);
  expect(document.querySelector('[role="alert"]').textContent).toContain("Quantity is below reserved stock.");
  expect(callback).not.toHaveBeenCalled();
});

test("rejects missing variants and prevents concurrent stock adjustments", async () => {
  act(() => drawer.showDrawer({ name: "Missing variant" }));
  await act(async () => { await drawer.onSubmit({ preventDefault: jest.fn() }); });
  expect(StockAdjustmentService.add).not.toHaveBeenCalled();
  let finish;
  StockAdjustmentService.add.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  act(() => drawer.showDrawer(product, selectedVariant));
  await act(async () => {
    const first = drawer.onSubmit({ preventDefault: jest.fn() });
    await drawer.onSubmit({ preventDefault: jest.fn() });
    expect(StockAdjustmentService.add).toHaveBeenCalledTimes(1);
    finish({ data: {} });
    await first;
  });
});
