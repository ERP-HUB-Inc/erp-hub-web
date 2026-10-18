export const costCategories = [
  { key: "affected", label: "All Affected SKUs" },
  { key: "increased", label: "Cost Increased" },
  { key: "decreased", label: "Cost Decreased" },
  { key: "stable", label: "Stable SKUs" }
];

export const finiteNumber = value => {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const costCategory = (row, threshold) => {
  const previousCost = finiteNumber(row.previousCost);
  const currentCost = finiteNumber(row.currentCost);
  const change = finiteNumber(row.changePercent);
  const magnitude = Math.abs(threshold);
  if (previousCost === null || previousCost <= 0 || currentCost === null || change === null) {
    return "unavailable";
  }

  // The exact threshold belongs to increased/decreased; zero is always stable.
  if (change > 0 && change >= magnitude) return "increased";
  if (change < 0 && Math.abs(change) >= magnitude) return "decreased";
  return "stable";
};

export const groupCostRows = (rows, threshold) => {
  const groups = { affected: [], increased: [], decreased: [], stable: [], unavailable: [] };
  rows.forEach(row => {
    const category = costCategory(row, threshold);
    groups[category].push(row);
    if (category === "increased" || category === "decreased") groups.affected.push(row);
  });
  return groups;
};

export const filterCostRows = (rows, query) => {
  const search = query.trim().toLocaleLowerCase();
  return rows.filter(row => [row.itemName, row.variantName, row.sku]
    .some(value => String(value || "").toLocaleLowerCase().includes(search)));
};

export const batchImpact = rows => {
  if (!rows.length) return null;
  let total = 0;
  for (const row of rows) {
    const change = finiteNumber(row.changeAmount);
    const quantity = finiteNumber(row.currentQuantity);
    if (change === null || quantity === null || quantity < 0) return null;
    total += change * quantity;
  }
  return total;
};

export const costProductName = row => [row.itemName, row.variantName]
  .map(value => String(value || "").trim())
  .filter(Boolean)
  .join(" / ") || "Unnamed product";

export const grossMarginComparison = row => {
  const current = finiteNumber(row.currentGrossMarginPercent);
  const previous = finiteNumber(row.previousGrossMarginPercent);
  const difference = current !== null && previous !== null ? current - previous : null;
  let tone = "neutral";
  if (current !== null && (current < 0 || difference < 0)) tone = "negative";
  else if (difference > 0) tone = "positive";

  return { current, previous, difference, tone };
};

export const costAlertKey = (rows, context) => JSON.stringify({
  context,
  items: rows.map(row => [
    row.itemId, row.variantId, row.previousCost, row.currentCost, row.currentQuantity,
    row.sellingPrice, row.previousGrossMarginPercent, row.currentGrossMarginPercent, row.pricingBasis
  ])
});
