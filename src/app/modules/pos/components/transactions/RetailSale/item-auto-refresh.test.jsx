import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ItemAutoRefresh from "./item-auto-refresh";

jest.mock("antd", () => {
  const React = require("react");
  const Select = ({ children, onChange, ...props }) => (
    <select {...props} onChange={(event) => onChange(Number(event.target.value))}>{children}</select>
  );
  Select.Option = ({ children, value }) => <option value={value}>{children}</option>;
  return { Select };
});

let container;
let onRefresh;

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
  onRefresh = jest.fn();
  act(() => { ReactDOM.render(<ItemAutoRefresh onRefresh={onRefresh} />, container); });
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.clearAllTimers();
  jest.useRealTimers();
});

const selectInterval = (seconds) => {
  act(() => {
    Simulate.change(container.querySelector("select"), { target: { value: String(seconds) } });
  });
};

test("auto-refresh is off initially", () => {
  expect(container.querySelector("select").value).toBe("0");
  act(() => { jest.advanceTimersByTime(30000); });
  expect(onRefresh).not.toHaveBeenCalled();
});

test.each([10, 15, 20])("refreshes every %s seconds", (seconds) => {
  selectInterval(seconds);
  act(() => { jest.advanceTimersByTime(seconds * 1000 - 1); });
  expect(onRefresh).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(1); });
  expect(onRefresh).toHaveBeenCalledTimes(1);
  act(() => { jest.advanceTimersByTime(seconds * 1000); });
  expect(onRefresh).toHaveBeenCalledTimes(2);
});

test("changing the interval replaces the previous timer and Off stops it", () => {
  selectInterval(10);
  selectInterval(20);
  act(() => { jest.advanceTimersByTime(10000); });
  expect(onRefresh).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(10000); });
  expect(onRefresh).toHaveBeenCalledTimes(1);
  selectInterval(0);
  act(() => { jest.advanceTimersByTime(30000); });
  expect(onRefresh).toHaveBeenCalledTimes(1);
});

test("leaving the screen stops auto-refresh", () => {
  selectInterval(10);
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  act(() => { jest.advanceTimersByTime(30000); });
  expect(onRefresh).not.toHaveBeenCalled();
});
