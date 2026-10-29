import { buildCategoryCreatePayload } from "./create-payload";

test("prepares the supplied backend contract with a numeric gross margin", () => {
  const values = Object.freeze({
    name: "Drinks", namekm: "ភេសជ្ជៈ", namebm: "", code: "DRINKS", parentId: null,
    description: "All beverage products", label: "Drinks", status: 1,
    isDefault: false, isFeature: false, posQuickAccessEnabled: true,
    defaultMarginValue: "25", posIcon: "beverage", displayPriority: 12, displayMode: "icon"
  });
  expect(buildCategoryCreatePayload(values, { name: "Blue", hex: "#2563eb" }, "")).toEqual({
    name: "Drinks", namekm: "ភេសជ្ជៈ", namebm: "", code: "DRINKS", parentId: null, image: "",
    description: "All beverage products", label: "Drinks", status: 1,
    isDefault: false, isFeature: false, posColor: { name: "Blue", hex: "#2563EB" },
    posQuickAccessEnabled: true, defaultMarginRule: { type: "GROSS_MARGIN", value: 25 }
  });
  expect(values.defaultMarginValue).toBe("25");
});

test("defaults unfilled details and omits an unconfigured margin", () => {
  expect(buildCategoryCreatePayload({ name: "Drinks" }, { name: "Green", hex: "#059669" })).toEqual({
    name: "Drinks", namekm: "", namebm: "", code: "", parentId: null, image: "", description: "", label: "",
    status: 1, isDefault: false, isFeature: false, posQuickAccessEnabled: false,
    posColor: { name: "Green", hex: "#059669" }
  });
});

test("preserves zero values, selected IDs, boolean flags, and the existing image value", () => {
  const payload = buildCategoryCreatePayload({
    name: "Drinks", namebm: "Burmese name", parentId: 0, status: 0,
    isDefault: true, isFeature: true, posQuickAccessEnabled: false, defaultMarginValue: 0
  }, { name: "Custom color", hex: "#aabbcc" }, "stored.png");
  expect(payload).toMatchObject({
    namebm: "Burmese name", parentId: 0, status: 0, isDefault: true, isFeature: true,
    posQuickAccessEnabled: false, defaultMarginRule: { type: "GROSS_MARGIN", value: 0 },
    posColor: { name: "Custom color", hex: "#AABBCC" }, image: "stored.png"
  });
});

test.each([undefined, null, ""])("omits an empty margin (%s)", defaultMarginValue => {
  expect(buildCategoryCreatePayload({ name: "Drinks", defaultMarginValue }, { name: "Blue", hex: "#2563EB" }))
    .not.toHaveProperty("defaultMarginRule");
});
