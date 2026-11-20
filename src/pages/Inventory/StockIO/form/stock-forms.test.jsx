import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { Form } from "antd";
import sweetalert from "sweetalert";
import ItemService from "@services/ItemService";
import LocationService from "@services/LocationService";
import UnitService from "@services/UnitService";
import StockIOService from "@services/StockIOService";
import CreateForm from "./form.create";
import UpdateForm from "./form.update";

jest.mock("@services/ItemService", () => ({ get: jest.fn() }));
jest.mock("@services/LocationService", () => ({ get: jest.fn() }));
jest.mock("@services/UnitService", () => ({ get: jest.fn() }));
jest.mock("@services/StockIOService", () => ({
  getStockInById: jest.fn(), stockIn: jest.fn(), stockOut: jest.fn(),
  updateStockInById: jest.fn(), updateStockOutById: jest.fn(),
}));
jest.mock("sweetalert", () => jest.fn(() => Promise.resolve()));
jest.mock("@router/index", () => ({ push: jest.fn() }));
jest.mock("@helper/user", () => ({ getLocationId: () => "branch" }));
jest.mock("@helper/inventory", () => ({
  getUnitId: item => item.unitOfMeasurement.id,
  getUnitName: item => item.unitOfMeasurement.name,
  getItemSku: item => item.productVariants[0].sku,
  getQuantityOnHand: item => item.productVariants.reduce((sum, variant) => sum + variant.quantity, 0),
}));
jest.mock("@components/stateful", () => require("../../../../components/stateful/SelectItem"));
jest.mock("antd", () => {
  const React = require("react");
  const actual = jest.requireActual("antd");
  const Wrapper = ({ children }) => <div>{children}</div>;
  const Select = React.forwardRef(({ children, onChange, value, placeholder, onSearch }, ref) => <div>
    {onSearch && <input aria-label="Search items" onChange={event => onSearch(event.target.value)} />}
    <select ref={ref} aria-label={placeholder} value={value == null ? "" : value} onChange={event => onChange(event.target.value)}>
      <option value="" />
      {React.Children.toArray(children).map(option => <option key={option.props.value} value={option.props.value} disabled={option.props.disabled}>{option.props.value}</option>)}
    </select>
  </div>);
  Select.Option = () => null;
  const Input = React.forwardRef(({ value, onChange, placeholder }, ref) => <input ref={ref} placeholder={placeholder} value={value || ""} onChange={onChange} />);
  Input.TextArea = Input;
  return {
    ...actual, Form: actual.Form, Select, Input,
    DatePicker: React.forwardRef(() => null),
    InputNumber: React.forwardRef(({ value, onChange, placeholder }, ref) => <input ref={ref} aria-label={placeholder} type="number" value={value == null ? "" : value} onChange={event => onChange(Number(event.target.value))} />),
    Table: ({ columns, dataSource }) => <div>{dataSource.map((row, index) => <div key={row.key} data-row={index}>{columns.map(column => <div key={column.dataIndex || column.key || column.title}>{column.render ? column.render(row[column.dataIndex], row, index) : row[column.dataIndex]}</div>)}</div>)}</div>,
    Button: ({ children, onClick, disabled, icon }) => <button type="button" aria-label={typeof children === "string" ? children : icon} disabled={disabled} onClick={onClick}>{children}</button>,
    PageHeader: () => null, Row: Wrapper, Col: Wrapper, Card: Wrapper, Tag: Wrapper,
    Alert: () => null, Upload: Wrapper, Divider: () => null, Tooltip: Wrapper, Icon: () => null,
  };
});

const shirt = { id: "shirt", name: "Shirt", unitOfMeasurement: { id: "pcs", name: "Pieces" }, productVariants: [
  { id: "red", name: "Red", sku: "RED", quantity: 5 },
  { id: "blue", name: "Blue", sku: "BLUE", quantity: 8 },
] };
const WrappedCreate = Form.create()(CreateForm);
const WrappedUpdate = Form.create()(UpdateForm);
let container;
const settle = async callback => {
  await act(async () => {
    if (callback) callback();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};
const mount = Component => settle(() => ReactDOM.render(<Component match={{ params: { id: "movement" } }} />, container));
const button = text => Array.from(container.querySelectorAll("button")).find(node => node.textContent.trim() === text);
const row = index => container.querySelector(`[data-row="${index}"]`);
const choose = (index, variantId) => settle(() => Simulate.change(row(index).querySelector('select[aria-label="Type to search or pick an item"]'), { target: { value: variantId } }));
const quantity = (index, value) => settle(() => Simulate.change(row(index).querySelector('input[type="number"]'), { target: { value: String(value) } }));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "log").mockImplementation(() => {});
  container = document.createElement("div");
  document.body.appendChild(container);
  ItemService.get.mockResolvedValue({ data: { data: [shirt] } });
  LocationService.get.mockResolvedValue({ data: { data: [{ id: "branch", name: "Branch" }] } });
  UnitService.get.mockResolvedValue({ data: { data: [{ id: "pcs", name: "Pieces" }] } });
  StockIOService.stockIn.mockResolvedValue({});
  StockIOService.stockOut.mockResolvedValue({});
  StockIOService.updateStockInById.mockResolvedValue({});
  StockIOService.updateStockOutById.mockResolvedValue({});
  StockIOService.getStockInById.mockResolvedValue({ data: {
    type: "IN", locationId: "branch", date: "2026-11-19", entries: [
      { id: "saved-entry", itemId: "shirt", itemName: "Shirt", variantId: "blue", variantName: "Blue", unitId: "pcs", unitName: "Pieces", quantity: 2 },
    ],
  } });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  console.log.mockRestore();
});

test.each([["Submit All Items", 2], ["Save as Draft", 0]])("create %s submits the chosen variant and ignores the empty row", async (action, status) => {
  await mount(WrappedCreate);
  await choose(0, "blue");
  await quantity(0, 3);
  await settle(() => Simulate.click(button(action)));
  expect(StockIOService.stockIn).toHaveBeenCalledWith(expect.objectContaining({ status, quantity: 3, entries: [expect.objectContaining({ itemId: "shirt", variantId: "blue", variantName: "Blue", quantity: 3 })] }));
});

test.each(["Submit All Items", "Save as Draft"])("edit %s preserves saved variant outside the item page and updates the movement", async action => {
  ItemService.get.mockResolvedValue({ data: { data: [] } });
  await mount(WrappedUpdate);
  expect(row(0).querySelector('select[aria-label="Type to search or pick an item"]').value).toBe("blue");
  await settle(() => Simulate.click(button(action)));
  expect(StockIOService.updateStockInById).toHaveBeenCalledWith("movement", expect.objectContaining({ entries: [expect.objectContaining({ id: "saved-entry", itemId: "shirt", variantId: "blue" })] }));
  expect(StockIOService.stockIn).not.toHaveBeenCalled();
});

test("editing the chosen variant updates the submitted variant identity", async () => {
  await mount(WrappedUpdate);
  await choose(0, "red");
  await settle(() => Simulate.click(button("Save as Draft")));
  expect(StockIOService.updateStockInById).toHaveBeenCalledWith("movement", expect.objectContaining({ entries: [expect.objectContaining({ id: "saved-entry", variantId: "red", variantName: "Red" })] }));
});

test("a failed save keeps the selected variant and shows an error", async () => {
  StockIOService.stockIn.mockRejectedValue(new Error("Save failed"));
  await mount(WrappedCreate);
  await choose(0, "blue");
  await quantity(0, 3);
  await settle(() => Simulate.click(button("Submit All Items")));
  expect(sweetalert).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" }));
  expect(sweetalert).not.toHaveBeenCalledWith(expect.objectContaining({ icon: "success" }));
  expect(row(0).querySelector('select[aria-label="Type to search or pick an item"]').value).toBe("blue");
});

test("removing one variant keeps the remaining row's form values aligned", async () => {
  await mount(WrappedCreate);
  await choose(0, "blue");
  await quantity(0, 3);
  await choose(1, "red");
  await quantity(1, 2);
  await settle(() => Simulate.click(row(0).querySelector('button[aria-label="delete"]')));
  await settle(() => Simulate.click(button("Submit All Items")));
  expect(StockIOService.stockIn).toHaveBeenCalledWith(expect.objectContaining({ quantity: 2, entries: [expect.objectContaining({ variantId: "red", quantity: 2 })] }));
});

test("stock-out creation uses the selected variant and the stock-out service", async () => {
  await mount(WrappedCreate);
  await settle(() => Simulate.change(container.querySelector("select"), { target: { value: "OUT" } }));
  await choose(0, "blue");
  await quantity(0, 3);
  await settle(() => Simulate.click(button("Submit All Items")));
  expect(StockIOService.stockOut).toHaveBeenCalledWith(expect.objectContaining({ type: "OUT", entries: [expect.objectContaining({ variantId: "blue" })] }));
});
