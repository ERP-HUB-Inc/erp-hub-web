import moment from "moment";

/**
 * Build a valid stock-in payload from minimal input.
 * @param {Object} product - Product info from master data
 * @param {number} quantity - Quantity user entered
 * @param {Object} user - Logged-in user context
 * @returns {Object} Stock IO payload
 */
export function buildStockInPayload(stockIO) {
  const today = moment();
  const number = `ST-IN-${today.format("YYYYMMDD")}-${Date.now()}`;

  return {
    type: "IN",
    number,
    name: "Stock In",
    locationId: stockIO?.locationId || "DEFAULT-LOCATION",
    userId: stockIO?.userId || "SYSTEM",
    receiverId: stockIO?.userId || "SYSTEM",
    vendorId: stockIO.vendorId || null,
    date: today.toISOString(), // same ISO format as before
    description: `Auto stock-in created by ${stockIO?.username || "system"}`,
    status: "COMPLETED",
    entries: stockIO.entries.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        variantId: item.variantId || "DEFAULT-VARIANT",
        variantName: item.variantName || "Default",
        quantity: item.qtyIn,
        cost: item.cost || 0,
        unitId: item.unitId || "UNIT-PCS",
        unitName: item.unitName || "pcs",
      }))
  };
}
