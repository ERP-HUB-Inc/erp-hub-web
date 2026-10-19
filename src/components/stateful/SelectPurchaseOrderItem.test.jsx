import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ItemService from "../../services/ItemService";
import { message } from "antd";
import { SelectPurchaseOrderItem, PURCHASE_ORDER_ITEM_FILTER } from "./SelectPurchaseOrderItem";

jest.mock("../../services/ItemService", () => ({ get: jest.fn() }));
jest.mock("../../helper/inventory", () => ({
  getItemSku: () => "SKU",
  getQuantityOnHand: () => 0,
}));
jest.mock("antd", () => {
  const React = require("react");
  const Select = ({ children, onSearch, onChange, value, notFoundContent }) => (
    <div>
      <input aria-label="Search" onChange={event => onSearch(event.target.value)} />
      <select value={value || ""} onChange={event => onChange(Number(event.target.value))}>
        <option value="" />
        {children}
      </select>
      {notFoundContent}
    </div>
  );
  Select.Option = ({ value, disabled, children }) => <option value={value} disabled={disabled}>{children}</option>;
  return {
    Select,
    Tooltip: ({ children }) => children,
    Icon: () => <span>Loading</span>,
    message: { error: jest.fn() },
  };
});

let container;
const initialItems = [{ id: 1, name: "Initial tracked item" }];
const render = props => act(() => {
  ReactDOM.render(<SelectPurchaseOrderItem items={initialItems} {...props} />, container);
});
const search = value => act(() => {
  Simulate.change(container.querySelector("input"), { target: { value } });
});
const flushSearch = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
  });
};
const optionValues = () => Array.from(container.querySelectorAll("option")).map(option => option.value);

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.useRealTimers();
});

test("searches with the backend stock-tracking filter and forwards results and selection", async () => {
  const results = [{ id: 2, name: "Tracked search item" }];
  ItemService.get.mockResolvedValue({ data: { data: results } });
  const callback = jest.fn();
  const onChange = jest.fn();
  render({ callback, onChange, value: 1 });
  expect(optionValues()).toContain("1");
  search("Tracked");
  await flushSearch();
  expect(ItemService.get).toHaveBeenCalledWith({ limit: 15, search: "Tracked", filter: PURCHASE_ORDER_ITEM_FILTER });
  expect(JSON.parse(PURCHASE_ORDER_ITEM_FILTER)).toEqual({
    enableStockTracking: true,
  });
  expect(callback).toHaveBeenCalledWith(results);
  expect(optionValues()).toContain("2");
  act(() => Simulate.change(container.querySelector("select"), { target: { value: "2" } }));
  expect(onChange).toHaveBeenCalledWith(2);
});

test("empty results do not fall back to initial items", async () => {
  ItemService.get.mockResolvedValue({ data: { data: [] } });
  render();
  search("missing");
  await flushSearch();
  expect(optionValues()).toEqual([""]);
  expect(container.textContent).toContain("No items found");
});

test("debounces across renders and cancels pending searches on unmount", async () => {
  ItemService.get.mockResolvedValue({ data: { data: [] } });
  render();
  search("old");
  render();
  search("latest");
  await flushSearch();
  expect(ItemService.get).toHaveBeenCalledTimes(1);
  expect(ItemService.get.mock.calls[0][0].search).toBe("latest");
  search("cancelled");
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  await flushSearch();
  expect(ItemService.get).toHaveBeenCalledTimes(1);
});

test("ignores older responses after a newer search starts", async () => {
  let resolveOld;
  ItemService.get.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
  ItemService.get.mockResolvedValueOnce({ data: { data: [{ id: 3, name: "Latest" }] } });
  render();
  search("old");
  await flushSearch();
  search("latest");
  await flushSearch();
  await act(async () => {
    resolveOld({ data: { data: [{ id: 2, name: "Old" }] } });
    await Promise.resolve();
  });
  expect(optionValues()).toEqual(["", "3"]);
});

test("keeps an existing order item readable but disabled when absent from filtered choices", () => {
  render({ value: 9, selectedItem: { id: 9, name: "Historical item" } });
  const selected = container.querySelector("option[value='9']");
  expect(selected.textContent).toBe("Historical item");
  expect(selected.disabled).toBe(true);
  expect(container.querySelector("select").value).toBe("9");
});

test("reports search failures without restoring initial choices", async () => {
  ItemService.get.mockRejectedValue(new Error("Failed"));
  render();
  search("item");
  await flushSearch();
  expect(message.error).toHaveBeenCalledWith("Could not load items. Please try again.");
  expect(optionValues()).toEqual([""]);
  expect(container.textContent).not.toContain("Loading");
});
