import { stockItemSelection, stockEntryRow, buildStockEntries } from "./stock-item-selection";

jest.mock("@helper/inventory", () => ({
  getUnitId: item => item.unitOfMeasurement.id,
  getUnitName: item => item.unitOfMeasurement.name,
  getQuantityOnHand: item => item.productVariants.reduce((sum, variant) => sum + variant.quantity, 0),
}));

const item = {
  id: "shirt",
  name: "Shirt",
  unitOfMeasurement: { id: "pcs", name: "Pieces" },
  productVariants: [{ id: "blue", name: "Blue / Large", sku: "BLUE-L", quantity: 7, cost: 2 }],
};
const values = { item: ["blue", undefined], quantity: [3, undefined], unitId: ["pcs"], notes: ["Counted"], expiry: ["2027-02-01"] };

test("retains the selected variant, SKU, unit and its stock", () => {
  expect(stockItemSelection(item)).toMatchObject({
    itemId: "shirt", variantId: "blue", variantName: "Blue / Large", sku: "BLUE-L",
    currentStock: 7, unitId: "pcs", selectedItem: item,
  });
});

test("builds entries from saved selections without relying on a search result page", () => {
  const entries = buildStockEntries(values, [stockItemSelection(item), {}], []);
  expect(entries).toEqual([expect.objectContaining({
    itemId: "shirt", itemName: "Shirt", variantId: "blue", variantName: "Blue / Large",
    quantity: 3, unitId: "pcs", unitName: "Pieces", cost: 2,
    description: "Counted", expiryDate: "2027-02-01",
  })]);
});

test("keeps different variants of the same parent in separate entries", () => {
  const red = stockItemSelection({ ...item, productVariants: [{ id: "red", name: "Red", quantity: 4 }] });
  const entries = buildStockEntries({ item: ["blue", "red"], quantity: [3, 2] }, [stockItemSelection(item), red], []);
  expect(entries.map(entry => [entry.itemId, entry.variantId])).toEqual([["shirt", "blue"], ["shirt", "red"]]);
});

test("restores historical variants and entry IDs even outside the initial item page", () => {
  const row = stockEntryRow({ id: "saved-entry", itemId: "shirt", itemName: "Shirt", variantId: "blue", variantName: "Blue / Large", variant: { sku: "BLUE-L" }, unitId: "pcs", unitName: "Pieces" }, 0);
  expect(row.key).toBe("saved-entry");
  expect(row.selectedItem.productVariants[0]).toMatchObject({ id: "blue", name: "Blue / Large", sku: "BLUE-L" });
  expect(buildStockEntries(values, [row], [])[0]).toMatchObject({ id: "saved-entry", variantId: "blue" });
});

test.each([0, -1, undefined, NaN])("rejects invalid quantity %s", quantity => {
  expect(() => buildStockEntries({ ...values, quantity: [quantity] }, [stockItemSelection(item)], [])).toThrow("quantity greater than zero");
});

test("rejects missing and mismatched variant selections", () => {
  expect(() => buildStockEntries({ item: [], quantity: [] }, [], [])).toThrow("at least one item variant");
  expect(() => buildStockEntries(values, [{ itemId: "shirt" }], [])).toThrow("specific item variant");
  expect(() => buildStockEntries({ ...values, item: ["red"] }, [stockItemSelection(item)], [])).toThrow("specific item variant");
});
