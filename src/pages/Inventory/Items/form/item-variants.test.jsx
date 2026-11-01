import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ItemVariants, { hasItemVariants } from "./item-variants";
import VariantService from "@services/VariantService";

jest.mock("@services/VariantService", () => ({ getVariantsByItemId: jest.fn() }));

let container;
const response = (rows, total = rows.length) => ({ data: { data: rows, pagination: { total } } });
const mount = async (itemId = "item-1", props = {}) => {
  await act(async () => { ReactDOM.render(<ItemVariants key={itemId} itemId={itemId} stockUnit="pcs" {...props} formatCurrency={value => `$${value}`} />, container); });
};

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => ReactDOM.unmountComponentAtNode(container));
  container.remove();
  jest.resetAllMocks();
});

test("identifies variant items even when no variants are embedded in the list", () => {
  expect(hasItemVariants({ productOption: 1 })).toBe(true);
  expect(hasItemVariants({ productOption: "1", productVariants: [] })).toBe(true);
  expect(hasItemVariants({ productVariants: [{ id: "a" }, { id: "b" }] })).toBe(true);
  expect(hasItemVariants({ productOption: 0, productVariants: [{ id: "a" }] })).toBe(false);
});

test("loads variants on mount and paginates using backend offsets", async () => {
  VariantService.getVariantsByItemId.mockResolvedValueOnce(response([{ id: "v1", name: "Small", sku: "SM", barcode: "123", price: 5 }], 11))
    .mockResolvedValueOnce(response([{ id: "v11", name: "Large", price: 8 }], 11));
  await mount();
  expect(VariantService.getVariantsByItemId).toHaveBeenLastCalledWith({ itemId: "item-1", limit: 10, offset: 0 });
  expect(container.textContent).toContain("Small");
  expect(container.textContent).toContain("$5");
  await act(async () => { Simulate.click(container.querySelector('.ant-pagination-item[title="2"]')); });
  expect(VariantService.getVariantsByItemId).toHaveBeenLastCalledWith({ itemId: "item-1", limit: 10, offset: 10 });
  expect(container.textContent).toContain("Large");
  expect(container.textContent).not.toContain("Small");
});

test("shows failures and allows retrying without presenting an empty success", async () => {
  VariantService.getVariantsByItemId.mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce(response([]));
  await mount();
  expect(container.querySelector('[role="alert"]').textContent).toContain("Unable to load variants");
  expect(container.textContent).not.toContain("No active variants found.");
  await act(async () => { Simulate.click(container.querySelector('[role="alert"] button')); });
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.textContent).toContain("No active variants found.");
});

test("ignores a stale request after another item is opened", async () => {
  let resolveFirst;
  VariantService.getVariantsByItemId.mockReturnValueOnce(new Promise(resolve => { resolveFirst = resolve; }))
    .mockResolvedValueOnce(response([{ id: "b", name: "Second item variant" }]));
  await mount();
  expect(container.querySelector('.ant-spin-spinning')).not.toBeNull();
  await mount("item-2");
  await act(async () => { resolveFirst(response([{ id: "a", name: "Stale variant" }])); });
  expect(container.textContent).toContain("Second item variant");
  expect(container.textContent).not.toContain("Stale variant");
});

test("treats an invalid response as an error", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue({ data: {} });
  await mount();
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
});

test("displays API stock quantities with units, preserving zero, negative and fractional values", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([
    { id: "positive", name: "In stock", quantity: "12.50" },
    { id: "zero", name: "Out of stock", quantity: 0 },
    { id: "negative", name: "Negative stock", quantity: -2 },
    { id: "missing", name: "Missing stock", quantity: null }
  ]));
  await mount();
  expect(container.textContent).toContain("Stock on Hand");
  const rows = Array.from(container.querySelectorAll('tbody tr'));
  expect(rows[0].textContent).toContain("12.50pcs");
  expect(rows[1].textContent).toContain("0.00pcs");
  expect(rows[2].textContent).toContain("-2.00pcs");
  expect(rows[3].querySelectorAll('td')[3].textContent).toBe("—");
});

test("incoming stock uses its API field and shows unavailable until provided", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([
    { id: "incoming", quantity: 100, incomingStock: "7.50" },
    { id: "none", quantity: 20, incomingStock: 0 },
    { id: "missing", quantity: 30 },
    { id: "invalid", incomingStock: "invalid" }
  ]));
  await mount();
  const cells = Array.from(container.querySelectorAll('tbody tr')).map(row => row.querySelectorAll('td')[2]);
  expect(cells.map(cell => cell.textContent)).toEqual(["7.50pcs", "0.00pcs", "—", "—"]);
});


test("groups identifiers with the variant name and inherits the parent type", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([{ id: "v1", name: "Blue", sku: "BLUE-01", barcode: "12345" }]));
  await mount("item-1", { itemType: { name: "Physical Product" } });
  const cells = container.querySelectorAll('tbody tr td');
  expect(cells).toHaveLength(6);
  expect(cells[0].textContent).toBe("BlueBarcode: 12345");
  expect(cells[1].textContent).toBe("Physical Product");
  expect(Array.from(container.querySelectorAll('thead th')).map(cell => cell.textContent)).toEqual([
    "Variant", "Type", "Incoming Stock", "Stock on Hand", "Selling Price & Margin", "Actions"
  ]);
});

test("follows parent column visibility and widths", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([{ id: "v1", name: "Blue", quantity: 5 }]));
  await mount("item-1", { parentColumns: [{ key: "name" }, { key: "quantity", width: 180 }, { key: "action", width: 100 }] });
  expect(Array.from(container.querySelectorAll('thead th')).map(cell => cell.textContent)).toEqual(["Variant", "Stock on Hand", "Actions"]);
  const columns = container.querySelectorAll('colgroup col');
  expect(columns[1].style.width).toBe("180px");
  expect(columns[2].style.width).toBe("100px");
});

test("shows each variant's margin percentage using its own cost", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([
    { id: "v1", name: "Small", price: 11, cost: 8 },
    { id: "v2", name: "Large", price: 15, cost: 10 },
    { id: "v3", name: "Unknown cost", price: 20 }
  ]));
  await mount("item-1", { enableInventoryTracking: true });
  const margins = Array.from(container.querySelectorAll('.item-selling-price-margin')).map(node => node.textContent);
  expect(margins).toEqual(["+37.5% ($3)", "+50.0% ($5)", "Margin unavailable"]);
});

test("hides variant margins when the parent does not track inventory", async () => {
  VariantService.getVariantsByItemId.mockResolvedValue(response([{ id: "v1", price: 11, cost: 8 }]));
  await mount("item-1", { enableInventoryTracking: false });
  expect(container.querySelector('.item-selling-price-margin')).toBeNull();
  expect(container.textContent).toContain("$11");
});


test.each([
  ["View", "onView"], ["Edit", "onEdit"], ["Delete", "onDelete"], ["Edit Stock", "onEditStock"]
])("variant options %s targets the selected row", async (label, callback) => {
  const variant = { id: "v1", name: "Blue", quantity: 0 };
  const handler = jest.fn();
  VariantService.getVariantsByItemId.mockResolvedValue(response([variant]));
  await mount("item-1", { enableInventoryTracking: true, [callback]: handler });
  await act(async () => {
    Simulate.mouseEnter(container.querySelector('button[aria-label="Options for Blue"]'));
    await new Promise(resolve => setTimeout(resolve, 200));
  });
  const option = Array.from(document.querySelectorAll('.ant-dropdown-menu-item')).find(node => node.textContent.trim() === label);
  expect(option).toBeDefined();
  act(() => Simulate.click(option));
  expect(handler).toHaveBeenCalledWith(variant);
});
