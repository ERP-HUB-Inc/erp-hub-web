import { FIELDS, mappingErrors, suggestMapping } from "./model";

test("backend template names map every supported field without changing column indexes", () => {
  expect(suggestMapping(FIELDS.map(field => field.key))).toEqual(Object.fromEntries(FIELDS.map((field, i) => [field.key, i])));
});
test("Khmer and readable headers map automatically; ambiguous columns and SKUs require manual resolution", () => {
  expect(suggestMapping(["ឈ្មោះផលិតផល", "លេខកូដ", "តំលៃដើម", "តំលៃលក់រាយ"])).toEqual({ name: 0, barcode: 1, cost: 2, price: 3 });
  expect(suggestMapping(["Barcode", "Barcode"]).barcode).toBeUndefined();
  expect(suggestMapping(["SKU"]).barcode).toBeUndefined();
});
test("required fields come from capabilities and a column cannot be assigned twice", () => {
  expect(mappingErrors({}, [{ key: "barcode", label: "Barcode", required: true }])).toEqual(["Map Barcode."]);
  expect(mappingErrors({ name: 0, barcode: 1, cost: 2, price: 2 })).toContain("Map each source column to only one field.");
  expect(mappingErrors({ name: 0, barcode: 1, cost: 2, price: 3 })).toEqual([]);
});
