// Labels and aliases only. Parsing, field constraints, and row validation belong to the server.
export const FIELDS = [
  { key: "groupKey", label: "Variant Group Key", aliases: ["group key", "groupkey"] },
  { key: "name", label: "Product Name", required: true, aliases: ["name", "item name", "ឈ្មោះផលិតផល"] },
  { key: "attributeName", label: "Variant Attribute", aliases: ["attribute name", "attribute"] },
  { key: "attributeValue", label: "Variant Value", aliases: ["attribute value", "value"] },
  { key: "barcode", label: "Barcode", required: true, aliases: ["sku / barcode", "លេខកូដ"] },
  { key: "category", label: "Category", aliases: ["ប្រភេទ"] },
  { key: "cost", label: "Buying Cost", required: true, aliases: ["cost", "តំលៃដើម"] },
  { key: "price", label: "Retail Price", required: true, aliases: ["price", "តំលៃលក់រាយ"] },
  { key: "wholePrice", label: "Wholesale Price", aliases: ["តំលៃបោះដុំ"] },
  { key: "distributePrice", label: "Distributor Price", aliases: ["តំលៃដំណាងចែកចាយ"] },
  { key: "quantity", label: "Initial Quantity", aliases: ["initial qty", "qty", "opening stock", "ទំនិញក្នុងឃ្លាំង"] },
  { key: "unit", label: "Unit", aliases: ["ឯកតា"] }
];
const normalize = value => String(value == null ? "" : value).trim().toLowerCase();

export function suggestMapping(headers) {
  const mapping = {};
  FIELDS.forEach(field => {
    const names = [field.key, field.label, ...(field.aliases || [])].map(normalize);
    const matches = headers.map((header, i) => names.includes(normalize(header)) ? i : -1).filter(i => i >= 0);
    if (matches.length === 1) mapping[field.key] = matches[0];
  });
  return mapping;
}
export function mappingErrors(mapping, fields = FIELDS) {
  const errors = fields.filter(field => field.required && !Number.isInteger(mapping[field.key])).map(field => `Map ${field.label}.`);
  const used = Object.values(mapping).filter(Number.isInteger);
  if (new Set(used).size !== used.length) errors.push("Map each source column to only one field.");
  return errors;
}
