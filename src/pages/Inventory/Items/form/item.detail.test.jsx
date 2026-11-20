import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import ProductDetail from "./item.detail";
import ProductService from "@services/ItemService";

jest.mock("@router/index", () => ({}), { virtual: true });
jest.mock("@services/ItemService", () => ({ getById: jest.fn(), getDetailStock: jest.fn() }));
jest.mock("@common/util", () => jest.fn().mockImplementation(() => ({
  formatCurrency: value => `$${value}`, formatDate: value => value, getImageUrl: value => value
})), { virtual: true });
jest.mock("lucide-react", () => Object.fromEntries([
  "ArrowRightLeft", "Barcode", "Boxes", "CalendarClock", "DollarSign", "Edit3", "FileText", "Layers3",
  "PackageCheck", "Printer", "Save", "ShieldCheck", "Warehouse"
].map(name => [name, () => null])));
jest.mock("./movement.log", () => () => null);
jest.mock("./purchase.history", () => () => null);
jest.mock("./index.css", () => ({}));

let container;
beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
  ProductService.getById.mockResolvedValue({ data: { data: { name: "Test item", productVariants: [] } } });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

async function renderStock(groups) {
  ProductService.getDetailStock.mockResolvedValue({ data: { data: groups } });
  await act(async () => {
    ReactDOM.render(<ProductDetail location={{ search: "" }} match={{ params: { id: "test-item" } }} />, container);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
  return Array.from(container.querySelectorAll(".item-detail-table .ant-table-tbody tr"));
}

test("shows each variant alongside its location, preferring the location variant name", async () => {
  const rows = await renderStock([
    { id: "variant-a", name: "Group A", productLocations: [
      { id: 1, location: "Main Warehouse", variantName: '24"(60cm) (*10)', quantity: 3 }
    ] },
    { id: "variant-b", name: "Group B", productLocations: [
      { id: 2, location: "Main Warehouse", variantName: "Small", quantity: 5 },
      { id: 3, location: "Branch", quantity: 2 }
    ] }
  ]);
  expect(container.querySelector(".item-detail-table thead").textContent).toContain("Variant Name");
  expect(container.querySelector(".item-detail-table thead").textContent).not.toContain("Status");
  expect(rows).toHaveLength(3);
  expect(rows.map(row => Array.from(row.querySelectorAll("td")).slice(0, 2).map(cell => cell.textContent))).toEqual([
    ["Main Warehouse", '24"(60cm) (*10)'],
    ["Main Warehouse", "Small"],
    ["Branch", "Group B"]
  ]);
  expect(rows[0].textContent).toContain("3 Pcs");
});

test("uses a dash when the variant name is missing and supports flat rows with variantName", async () => {
  const rows = await renderStock([
    { id: "variant-a", productLocations: [{ id: 1, location: "Main Warehouse", quantity: 0 }] },
    { id: "flat", variantName: "Flat variant", quantity: 1 }
  ]);
  expect(rows[0].querySelectorAll("td")[1].textContent).toBe("—");
  expect(rows[1].querySelectorAll("td")[1].textContent).toBe("Flat variant");
});
