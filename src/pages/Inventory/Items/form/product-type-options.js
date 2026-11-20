export const DEFAULT_PRODUCT_TYPES = [
  {
    id: 0,
    code: "PHYSICAL_PRODUCT",
    name: "Physical Product",
    enableInventoryTracking: true,
    sellable: true,
  },
  {
    id: 1,
    code: "SERVICE",
    name: "Service",
    enableInventoryTracking: false,
    sellable: true,
  },
  {
    id: 2,
    code: "BUNDLE_COMBO",
    name: "Bundle / Combo",
    enableInventoryTracking: true,
    sellable: true,
  },
  {
    id: 3,
    code: "RAW_MATERIAL",
    name: "Raw Material",
    enableInventoryTracking: true,
    sellable: false,
  },
  {
    id: 4,
    code: "NON_STOCK_ITEM",
    name: "Non-Stock Item",
    enableInventoryTracking: false,
    sellable: true,
  },
];

// Keep persisted UUID identities separate from the legacy numeric product type.
export function getDefaultProductTypeId(type) {
  if (type === null || type === undefined || String(type).trim() === "") return 0;
  const numericType = Number(type);
  return Number.isFinite(numericType) ? numericType : String(type).trim();
}

export function normalizeProductTypes(productTypes = []) {
  const source = Array.isArray(productTypes) && productTypes.length ? productTypes : DEFAULT_PRODUCT_TYPES;
  const seen = new Set();
  const options = [];
  source.forEach(productType => {
    const id = productType?.id;
    if (typeof id !== "string" && typeof id !== "number") return;
    if (id === null || id === undefined || String(id).trim() === "" || (typeof id === "number" && !Number.isFinite(id))) return;
    const normalizedId = getDefaultProductTypeId(id);
    const key = String(normalizedId);
    if (seen.has(key)) return;
    seen.add(key);
    options.push({ ...productType, id: normalizedId, name: productType.name || productType.label || productType.code });
  });
  return options.length ? options : DEFAULT_PRODUCT_TYPES;
}

export function getProductTypePayload(type) {
  const selected = getDefaultProductTypeId(type);
  // The backend resolves the numeric type from the referenced product type record.
  return typeof selected === "string" ? { productTypeId: selected, type: 0 } : { type: selected };
}
