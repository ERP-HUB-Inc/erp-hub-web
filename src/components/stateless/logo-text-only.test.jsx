import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { LogoTextOnly } from "./logo-text-only";

jest.mock("antd", () => ({ Tooltip: ({ children }) => children, Icon: () => null }));

let container;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});
const render = props => act(() => { ReactDOM.render(<LogoTextOnly {...props} />, container); });

test("expanded branding displays only the logo without duplicate platform text or a badge", () => {
  render({});
  expect(container.querySelector("img").getAttribute("src")).toBe("/marketchain-logo.png");
  expect(container.querySelector("img").alt).toBe("MarketChain ERP logo");
  expect(container.textContent).toBe("");
  expect(container.querySelector("button")).toBeNull();
});

test("collapsed branding uses the compact logo and restores the full logo on expansion", () => {
  render({ collapsed: true });
  expect(container.querySelector("img").getAttribute("src")).toBe("/marketchain-logo-only.png");
  expect(container.querySelector("img").alt).toBe("MarketChain ERP logo");
  expect(container.querySelector("button")).toBeNull();
  expect(container.textContent).toBe("");
  render({ collapsed: false });
  expect(container.querySelector("img").getAttribute("src")).toBe("/marketchain-logo.png");
});
