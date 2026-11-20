import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { Select, message } from "antd";
import ItemService from "@services/ItemService";
import { SelectItem } from "./SelectItem";

jest.mock("@services/ItemService", () => ({ get: jest.fn() }));
jest.mock("@helper/inventory", () => ({
  getItemSku: item => item.productVariants[0].sku,
  getQuantityOnHand: item => item.productVariants.reduce((sum, variant) => sum + variant.quantity, 0),
}));
jest.mock("antd", () => {
  const React = require("react");
  return {
    Select: Object.assign(React.forwardRef(jest.fn(({ children }, ref) => <div ref={ref}>{children}</div>)), {
      Option: ({ children, value, disabled }) => <div data-value={value} aria-disabled={disabled}>{children}</div>,
    }),
    Tooltip: ({ children }) => children,
    Icon: () => null,
    message: { error: jest.fn() },
  };
});

const item = { id: "shirt", name: "Shirt", productVariants: [
  { id: "red", name: "Red", sku: "RED", quantity: 3 },
  { id: "blue", name: "Blue", sku: "BLUE", quantity: 7 },
] };
let container;
const render = props => act(() => { ReactDOM.render(<SelectItem items={[item]} {...props} />, container); });
const selectProps = () => Select.render.mock.calls[Select.render.mock.calls.length - 1][0];
const search = value => act(() => selectProps().onSearch(value));
const settle = () => act(async () => { jest.advanceTimersByTime(1000); await Promise.resolve(); });

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  container = document.createElement("div");
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  jest.useRealTimers();
});

test("offers each variant with its own name, SKU and stock, and forwards the selected variant", () => {
  const onChange = jest.fn();
  render({ selectVariants: true, value: "blue", onChange });
  const red = container.querySelector('[data-value="red"]');
  const blue = container.querySelector('[data-value="blue"]');
  expect(red.textContent).toContain("ShirtRedSKU: RED | Stock: 3");
  expect(blue.textContent).toContain("ShirtBlueSKU: BLUE | Stock: 7");
  expect(blue.querySelector("small").textContent).toBe("Blue");
  expect(blue.querySelector("small").previousElementSibling.textContent).toBe("Shirt");
  expect(blue.querySelector("small").style.display).toBe("block");
  expect(selectProps().value).toBe("blue");
  act(() => selectProps().onChange("blue"));
  expect(onChange).toHaveBeenCalledWith("blue", { ...item, productVariants: [item.productVariants[1]] });
});

test("keeps standard products selectable and preserves the default parent-item mode", () => {
  render({ selectVariants: true, items: [{ ...item, productVariants: [item.productVariants[0]] }] });
  expect(container.querySelectorAll("[data-value]")).toHaveLength(1);
  render({});
  expect(container.querySelector('[data-value="shirt"]')).not.toBeNull();
});

test("search selection returns metadata for a result outside the initial page", async () => {
  const result = { ...item, id: "hat", name: "Hat", productVariants: [{ id: "hat-xl", name: "XL", quantity: 2 }] };
  ItemService.get.mockResolvedValue({ data: { data: [result] } });
  const onChange = jest.fn();
  render({ selectVariants: true, onChange, locationId: "branch" });
  search("hat");
  await settle();
  expect(ItemService.get).toHaveBeenCalledWith({ limit: 15, search: "hat", locationId: "branch" });
  act(() => selectProps().onChange("hat-xl"));
  expect(onChange).toHaveBeenCalledWith("hat-xl", result);
});

test("empty results keep the saved variant label without offering old search results", async () => {
  ItemService.get.mockResolvedValue({ data: { data: [] } });
  render({ selectVariants: true, selectedItem: { ...item, productVariants: [item.productVariants[1]] } });
  search("absent");
  await settle();
  expect(container.querySelector('[data-value="red"]')).toBeNull();
  expect(container.querySelector('[data-value="blue"]').getAttribute("aria-disabled")).toBe("true");
});

test("failed searches show an error", async () => {
  ItemService.get.mockRejectedValue(new Error("Unavailable"));
  render({ selectVariants: true });
  search("hat");
  await settle();
  expect(message.error).toHaveBeenCalledWith("Could not load items. Please try again.");
});

test("debounces across renders and cancels work on unmount", async () => {
  ItemService.get.mockResolvedValue({ data: { data: [] } });
  render({});
  search("old");
  render({});
  search("latest");
  await settle();
  expect(ItemService.get).toHaveBeenCalledTimes(1);
  expect(ItemService.get.mock.calls[0][0].search).toBe("latest");
  search("cancel");
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  await settle();
  expect(ItemService.get).toHaveBeenCalledTimes(1);
});
