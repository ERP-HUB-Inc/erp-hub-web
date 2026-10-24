import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { TextDecoder } from "util";
import ItemImport from "./index";

global.TextDecoder = TextDecoder;
let container;
const push = jest.fn();
const button = label => Array.from(container.querySelectorAll("button")).find(element => element.textContent.includes(label));
const select = label => Array.from(container.querySelectorAll("label")).find(element => element.firstElementChild && element.firstElementChild.textContent.includes(label)).querySelector("select");
const click = label => act(() => { Simulate.click(button(label)); });
const upload = async csv => {
  const file = new File([csv], "catalog.csv", { type: "text/csv" });
  await act(async () => {
    Simulate.change(container.querySelector("input[type='file']"), { target: { files: [file], value: "" } });
    await new Promise(resolve => setTimeout(resolve, 40));
  });
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => { ReactDOM.render(<MemoryRouter><ItemImport history={{ push }} /></MemoryRouter>, container); });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.clearAllMocks();
});

test("initial page has truthful service states and prevents skipping file preparation", () => {
  expect(container.textContent).toContain("Import Items from Excel / CSV");
  expect(button("Continue to Mapping").disabled).toBe(true);
  expect(container.querySelectorAll("input[type='radio']:disabled")).toHaveLength(2);
  expect(container.textContent).toContain("Status unavailable");
  expect(container.textContent).toContain("Import history is unavailable");
  expect(container.textContent).not.toMatch(/Synced|Server Ready|TLS 1.3|42,890/);
  expect(select("Target Warehouse").disabled).toBe(true);
  click("Discard & Back to Items");
  expect(push).toHaveBeenCalledWith("/inventories/items");
});

test("a valid file proceeds through mapping, cleansing, and review without claiming ingestion", async () => {
  await upload("Product Name,Barcode,Buying Cost,Retail Price\nCoffee,000012,0,2.50");
  expect(button("Continue to Mapping").disabled).toBe(false);
  click("Continue to Mapping");
  expect(container.querySelector("[aria-current='step']").textContent).toContain("Schema & Mapping");
  expect(button("Validate Data").disabled).toBe(false);
  click("Validate Data");
  expect(container.textContent).toContain("000012");
  expect(container.textContent).toContain("Local checks passed; server validation is still required");
  click("Review Import");
  expect(container.textContent).toContain("No import has been committed");
  expect(button("Commit Import").disabled).toBe(true);
  click("Back to Validation");
  click("Back to Mapping");
  click("Back to Upload");
  expect(container.textContent).toContain("catalog.csv");
  act(() => { Simulate.click(container.querySelector("[aria-label='Remove selected file']")); });
  expect(button("Continue to Mapping").disabled).toBe(true);
});

test("mapping errors and malformed money block progression", async () => {
  await upload("Product Name,Barcode,Buying Cost,Retail Price\nCoffee,000012,NaN,2.50");
  click("Continue to Mapping");
  act(() => { Simulate.change(select("Retail Price"), { target: { value: "" } }); });
  expect(button("Validate Data").disabled).toBe(true);
  act(() => { Simulate.change(select("Retail Price"), { target: { value: "3" } }); });
  click("Validate Data");
  expect(container.textContent).toContain("Buying Cost must be a non-negative decimal");
  expect(button("Review Import").disabled).toBe(true);
});

test("duplicate resolution skips only disclosed source rows", async () => {
  await upload("Product Name,Barcode,Buying Cost,Retail Price\nOld,000012,0,1\nNew,000012,1,2");
  act(() => { Simulate.change(select("Duplicate Barcode Handling"), { target: { value: "last" } }); });
  click("Continue to Mapping");
  click("Validate Data");
  expect(container.textContent).toContain("Replaced by source row 3");
  expect(button("Review Import").disabled).toBe(false);
});
