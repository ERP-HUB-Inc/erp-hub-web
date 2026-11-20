import { DEFAULT_PRODUCT_TYPES, normalizeProductTypes, getDefaultProductTypeId, getProductTypePayload } from "./product-type-options";

const physicalId = "11111111-1111-4111-8111-111111111111";
const serviceId = "22222222-2222-4222-8222-222222222222";

test("UUID product types retain separate option keys and selectable values", () => {
  const types = [
    { id: physicalId, code: "PHYSICAL_PRODUCT", name: "Physical Product", enableInventoryTracking: true },
    { id: serviceId, code: "SERVICE", label: "Service", enableInventoryTracking: false }
  ];
  const options = normalizeProductTypes(types);
  expect(options.map(option => option.id)).toEqual([physicalId, serviceId]);
  expect(options[1]).toEqual(expect.objectContaining({ name: "Service", enableInventoryTracking: false }));
  expect(types[1].name).toBeUndefined();
  expect(normalizeProductTypes(options)).toEqual(options);
});

test("duplicate UUID records produce only one option per ID, while duplicate names retain distinct identities", () => {
  const options = normalizeProductTypes([
    { id: physicalId, name: "Shared name" }, { id: physicalId, name: "Duplicate record" },
    { id: serviceId, name: "Shared name" }
  ]);
  expect(options).toEqual([{ id: physicalId, name: "Shared name" }, { id: serviceId, name: "Shared name" }]);
});

test("legacy numeric and string IDs normalize without duplicate React keys", () => {
  const options = normalizeProductTypes([{ id: 0, name: "Physical" }, { id: "0", name: "Duplicate" }, { id: "1", name: "Service" }]);
  expect(options.map(option => option.id)).toEqual([0, 1]);
});

test("malformed records do not create undefined or NaN option keys", () => {
  const options = normalizeProductTypes([null, {}, { id: NaN }, { id: " " }, { id: {} }, { id: serviceId, code: "SERVICE" }]);
  expect(options).toEqual([{ id: serviceId, code: "SERVICE", name: "SERVICE" }]);
});

test.each([undefined, null, [], {}, [{ id: null }]])("uses legacy defaults when no usable types are returned: %p", value => {
  expect(normalizeProductTypes(value)).toEqual(DEFAULT_PRODUCT_TYPES);
});

test.each([[physicalId, physicalId], [0, 0], ["1", 1], [undefined, 0]])("initial selection %p preserves the correct option value", (value, expected) => {
  expect(getDefaultProductTypeId(value)).toBe(expected);
});

test("UUID selections submit the persisted ID separately from the legacy numeric type", () => {
  expect(getProductTypePayload(serviceId)).toEqual({ productTypeId: serviceId, type: 0 });
  expect(getProductTypePayload("1")).toEqual({ type: 1 });
});
