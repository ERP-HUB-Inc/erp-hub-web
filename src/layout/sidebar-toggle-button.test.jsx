import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import SidebarToggleButton from "./sidebar-toggle-button";

jest.mock("antd", () => ({ Tooltip: ({ children }) => children }));

let container;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test.each([false, true])("header toggle reflects collapsed=%p and invokes the existing action", collapsed => {
  const onToggle = jest.fn();
  act(() => {
    ReactDOM.render(<SidebarToggleButton collapsed={collapsed} onToggle={onToggle} />, container);
  });
  const button = container.querySelector("button");
  expect(button.getAttribute("aria-label")).toBe(collapsed ? "Expand sidebar" : "Collapse sidebar");
  expect(button.getAttribute("aria-expanded")).toBe(String(!collapsed));
  expect(button.getAttribute("aria-controls")).toBe("market-sidebar-navigation");
  expect(button.querySelector("svg").classList.contains(collapsed ? "lucide-panel-left-open" : "lucide-panel-left-close")).toBe(true);
  act(() => { Simulate.click(button); });
  expect(onToggle).toHaveBeenCalledTimes(1);
});
