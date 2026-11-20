import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { Table, message } from "antd";
import MovementLog from "./movement.log";
import MovementLogService from "@services/MovementLogService";

jest.mock("@common/util", () => jest.fn().mockImplementation(() => ({ formatDate: value => value })), { virtual: true });
jest.mock("@services/MovementLogService", () => ({ getMovementLogs: jest.fn() }));
jest.mock("antd", () => {
  const React = require("react");
  const Wrapper = ({ children }) => <div>{children}</div>;
  const Select = ({ value, onChange, children }) => <select value={value} onChange={event => onChange(event.target.value)}>{children}</select>;
  Select.Option = ({ value, children }) => <option value={value}>{children}</option>;
  return {
    Card: ({ title, extra, children }) => <section><header>{title}{extra}</header>{children}</section>,
    Button: ({ children, onClick, disabled }) => <button onClick={onClick} disabled={disabled}>{children}</button>,
    Row: Wrapper, Col: Wrapper, Tag: Wrapper, Select,
    DatePicker: { RangePicker: () => null },
    Table: jest.fn(() => null), message: { error: jest.fn() },
  };
});

let container;
const rows = [{ id: "purchase", type: "PURCHASE" }, { id: "sale", type: "SALE" }];
const tableProps = () => Table.mock.calls[Table.mock.calls.length - 1][0];
const settle = async callback => {
  await act(async () => {
    if (callback) callback();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};
const mount = (id = "item") => settle(() => ReactDOM.render(<MovementLog id={id} />, container));

beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement("div");
  MovementLogService.getMovementLogs.mockResolvedValue({ data: rows });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
});

test("refreshes from the header and preserves the selected filter", async () => {
  await mount();
  await settle(() => Simulate.change(container.querySelector("select"), { target: { value: "RECEIPTS" } }));
  const updated = { id: "new-purchase", type: "PURCHASE" };
  MovementLogService.getMovementLogs.mockResolvedValue({ data: [...rows, updated] });
  await settle(() => Simulate.click(container.querySelector("header button")));
  expect(MovementLogService.getMovementLogs).toHaveBeenCalledTimes(2);
  expect(MovementLogService.getMovementLogs).toHaveBeenLastCalledWith("item");
  expect(container.querySelector("select").value).toBe("RECEIPTS");
  expect(tableProps().dataSource.map(row => row.id)).toEqual(["purchase", "new-purchase"]);
});

test("disables refresh while loading and enables it when the request finishes", async () => {
  let resolve;
  MovementLogService.getMovementLogs.mockReturnValue(new Promise(done => { resolve = done; }));
  await mount();
  expect(container.querySelector("button").disabled).toBe(true);
  expect(tableProps().loading).toBe(true);
  await settle(() => resolve({ data: rows }));
  expect(container.querySelector("button").disabled).toBe(false);
  expect(tableProps().loading).toBe(false);
});

test("failed refresh keeps existing logs and allows retry", async () => {
  await mount();
  MovementLogService.getMovementLogs.mockRejectedValueOnce(new Error("Unavailable"));
  await settle(() => Simulate.click(container.querySelector("button")));
  expect(message.error).toHaveBeenCalledWith("Could not load movement logs. Please try again.");
  expect(tableProps().dataSource).toEqual(rows);
  expect(container.querySelector("button").disabled).toBe(false);
});

test("loads the current item and ignores the previous item's late response", async () => {
  let resolve;
  MovementLogService.getMovementLogs.mockReturnValueOnce(new Promise(done => { resolve = done; }));
  await mount("old-item");
  await mount("new-item");
  await settle(() => resolve({ data: [{ id: "old", type: "SALE" }] }));
  expect(MovementLogService.getMovementLogs).toHaveBeenLastCalledWith("new-item");
  expect(tableProps().dataSource).toEqual(rows);
});
