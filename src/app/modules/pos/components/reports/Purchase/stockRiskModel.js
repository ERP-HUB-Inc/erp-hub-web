import { finiteNumber } from "./costChangesModel";

export const stockRiskCategories = [
  { key: "all", label: "All Items" },
  { key: "critical", label: "Critical Risk" },
  { key: "high", label: "High Risk" },
  { key: "healthy", label: "Healthy" }
];

const riskLabels = {
  critical: "CRITICAL",
  high: "HIGH RISK",
  healthy: "HEALTHY",
  unavailable: "UNAVAILABLE"
};

export const stockRiskCategory = risk => {
  const value = String(risk || "").trim().toUpperCase();
  if (value === "CRITICAL") return "critical";
  if (value === "HIGH" || value === "HIGH_RISK") return "high";
  if (value === "NORMAL" || value === "HEALTHY") return "healthy";
  return "unavailable";
};

export const stockRiskLabel = risk => riskLabels[stockRiskCategory(risk)];

export const stockValuation = (summary = {}) => {
  const amount = finiteNumber(summary.totalExcessStockValue);
  const currency = typeof summary.currencyCode === "string" ? summary.currencyCode.trim() : "";
  if (amount !== null && currency) return { amount, currency, unavailableReason: null };

  const reasons = [];
  const unavailableProducts = finiteNumber(summary.valuationUnavailableProducts);
  if (unavailableProducts !== null && unavailableProducts > 0) {
    reasons.push(`Valuation is unavailable for ${unavailableProducts.toLocaleString()} excess-stock products.`);
  }
  if (!currency) reasons.push("Report currency is unavailable.");
  return {
    amount,
    currency,
    unavailableReason: reasons.join(" ") || "Excess-stock valuation is unavailable."
  };
};

export const groupStockRows = rows => {
  const groups = { all: rows, critical: [], high: [], healthy: [], unavailable: [] };
  rows.forEach(row => groups[stockRiskCategory(row.risk)].push(row));
  return groups;
};

export const filterStockRows = (rows, query) => {
  const search = query.trim().toLocaleLowerCase();
  return rows.filter(row => [row.itemName, row.variantName, row.sku]
    .some(value => String(value || "").toLocaleLowerCase().includes(search)));
};

export const stockProductName = row => [row.itemName, row.variantName]
  .map(value => String(value || "").trim())
  .filter(Boolean)
  .join(" / ") || "Unnamed product";

export const stockCoverage = row => {
  const days = finiteNumber(row.stockCoverageDays);
  const stock = finiteNumber(row.currentStock);
  const velocity = finiteNumber(row.averageDailySales);
  const sales = finiteNumber(row.soldQuantity);
  const threshold = finiteNumber(row.thresholdDays);

  if (days !== null && days >= 0) {
    let detail = "Reported stock coverage";
    if (threshold !== null) {
      detail = days > threshold
        ? `${(days - threshold).toFixed(1)}d above threshold`
        : "Within coverage threshold";
    }
    return { label: `${days.toFixed(1)} Days`, detail };
  }
  if (stock === 0) return { label: "—", detail: "No stock on hand" };
  if (stock !== null && stock > 0 && velocity === 0 && sales === 0) {
    return { label: "No Sales (∞)", detail: "Zero movement" };
  }
  if (velocity === null || sales === null) {
    return { label: "—", detail: "Sales history unavailable" };
  }
  return { label: "—", detail: "Coverage unavailable" };
};

export const stockPageRange = (total, page, pageSize) => {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(1, Math.min(page, lastPage));
  return {
    current,
    start: total ? (current - 1) * pageSize + 1 : 0,
    end: Math.min(current * pageSize, total)
  };
};
