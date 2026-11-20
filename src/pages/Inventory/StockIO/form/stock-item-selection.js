import moment from "moment";
import Util from "@helper/inventory";

export function stockItemSelection(item) {
  const variant = item && item.productVariants && item.productVariants[0];
  if (!variant || variant.id == null) return {};
  return {
    itemId: item.id,
    itemName: item.name,
    variantId: variant.id,
    variantName: variant.name || "",
    sku: variant.sku || "",
    cost: Number(variant.cost) || 0,
    unitId: Util.getUnitId(item),
    unitName: Util.getUnitName(item),
    currentStock: Util.getQuantityOnHand(item),
    avgQuantity: item.avgQuantity,
    selectedItem: item,
  };
}

export function stockEntryRow(entry, index) {
  const variantId = entry.variantId || (entry.variant && entry.variant.id);
  const variant = { ...entry.variant, id: variantId, name: entry.variantName || (entry.variant && entry.variant.name) || "" };
  return {
    ...entry,
    key: entry.id || `entry-${index}`,
    variantId,
    variantName: variant.name,
    sku: variant.sku || "",
    notes: entry.notes || entry.description || "",
    expiry: entry.expiryDate ? moment(entry.expiryDate) : null,
    selectedItem: {
      id: entry.itemId,
      name: entry.itemName,
      productVariants: variantId ? [variant] : [],
      unitOfMeasurement: { id: entry.unitId, name: entry.unitName },
    },
  };
}

// Keep the selected variant independent of the current search result page.
export function buildStockEntries(values, rows, units) {
  const entries = (values.item || []).reduce((result, variantId, index) => {
    if (variantId == null || variantId === "") return result;
    const row = rows[index];
    if (!row || !row.itemId || row.variantId == null || String(row.variantId) !== String(variantId)) {
      throw new Error("Please select a specific item variant for each stock row.");
    }
    const quantity = Number((values.quantity || [])[index]);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error("Please enter a quantity greater than zero for each selected item.");
    }
    const unitId = (values.unitId || [])[index] || row.unitId;
    const unit = units.find(unit => String(unit.id) === String(unitId));
    const expiry = (values.expiry || [])[index];
    result.push({
      ...(row.id ? { id: row.id } : {}),
      itemId: row.itemId,
      itemName: row.itemName,
      variantId: row.variantId,
      variantName: row.variantName,
      unitId,
      unitName: unit ? unit.name : row.unitName || "",
      quantity,
      cost: Number(row.cost) || 0,
      reason: (values.reason || [])[index],
      batch: (values.batch || [])[index],
      expiryDate: expiry && moment(expiry).isValid() ? moment(expiry).format("YYYY-MM-DD") : null,
      description: (values.notes || [])[index],
    });
    return result;
  }, []);
  if (!entries.length) throw new Error("Please select at least one item variant.");
  return entries;
}
