import { finiteNumber } from "./costChangesModel";

export const purchaseSalesActivities = [
  { key: "PURCHASE_ONLY", label: "Purchase only", summaryKey: "purchaseOnlyProducts" },
  { key: "SALES_ONLY", label: "Sales only", summaryKey: "salesOnlyProducts" },
  { key: "PURCHASE_AHEAD", label: "Purchase ahead", summaryKey: "purchaseAheadProducts" },
  { key: "SALES_AHEAD", label: "Sales ahead", summaryKey: "salesAheadProducts" },
  { key: "BALANCED", label: "Balanced" }
];

export const productName = row => [row.itemName, row.variantName]
  .map(value => String(value || "").trim())
  .filter(Boolean)
  .join(" / ") || "Unnamed product";

export const unitComparison = row => {
  const bought = finiteNumber(row.purchaseQuantity);
  const sold = finiteNumber(row.salesQuantity);
  const reportedDifference = finiteNumber(row.quantityDifference);
  const difference = reportedDifference !== null
    ? reportedDifference
    : bought !== null && sold !== null ? bought - sold : null;
  const comparable = bought !== null && sold !== null && bought >= 0 && sold >= 0;
  const total = comparable ? bought + sold : 0;
  return {
    bought,
    sold,
    difference,
    boughtWidth: total > 0 ? bought / total * 100 : 0,
    soldWidth: total > 0 ? sold / total * 100 : 0,
    comparable
  };
};

export const grossProfitMetrics = record => {
  const revenue = finiteNumber(record.salesAmount);
  const sold = finiteNumber(record.salesQuantity);
  const profit = finiteNumber(record.grossProfit);
  if (sold === 0 && revenue === 0 && (profit === null || profit === 0)) {
    return { profit: null, margin: null, state: "awaiting", tone: "neutral" };
  }
  if (profit === null) return { profit: null, margin: null, state: "unavailable", tone: "neutral" };

  const margin = revenue !== null && revenue > 0 ? profit / revenue * 100 : null;
  const state = profit < 0 ? "loss" : profit > 0 ? "profit" : "breakEven";
  const tone = profit < 0 ? "negative" : profit > 0 ? "positive" : "neutral";
  return { profit, margin, state, tone };
};

export const profitBadge = metrics => {
  if (metrics.state === "awaiting") return "Awaiting Sale";
  if (metrics.state === "unavailable") return "Profit unavailable";
  if (metrics.state === "breakEven") return "Break-even";
  if (metrics.state === "loss") {
    return metrics.margin === null ? "Loss detected" : `${metrics.margin.toFixed(1)}% · Loss detected`;
  }
  return metrics.margin === null ? "Margin unavailable" : `${metrics.margin.toFixed(1)}% Margin`;
};

export const periodInsight = row => {
  const profit = grossProfitMetrics(row);
  if (profit.state === "loss") {
    return {
      label: "Realized loss",
      tone: "negative",
      icon: "warning",
      description: "Gross loss in this period. Review sales revenue and allocated costs."
    };
  }
  const labels = {
    PURCHASE_ONLY: "Purchases recorded without sales in this period.",
    SALES_ONLY: "Sales recorded without purchases in this period.",
    PURCHASE_AHEAD: "Purchase quantity exceeds sales in this period.",
    SALES_AHEAD: "Sales quantity exceeds purchases in this period.",
    BALANCED: "Purchase and sales quantities are balanced for this period."
  };
  const activity = purchaseSalesActivities.find(item => item.key === row.activityStatus);
  return {
    label: activity ? activity.label : "Inventory status unavailable",
    tone: "neutral",
    icon: activity ? "swap" : "info-circle",
    description: activity
      ? `${labels[activity.key]} Review current stock before taking inventory action.`
      : "Current stock and inventory policy data are needed for recommendations."
  };
};

export const filterPurchaseSalesRows = (rows, { search, activity, category }) => {
  const query = search.trim().toLocaleLowerCase();
  return rows.filter(row => {
    const matchesSearch = [row.itemName, row.variantName, row.sku]
      .some(value => String(value || "").toLocaleLowerCase().includes(query));
    return matchesSearch && (!activity || row.activityStatus === activity) &&
      (!category || row.categoryName === category);
  });
};

export const purchaseSalesPage = (total, page, pageSize) => {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(1, Math.min(page, last));
  return {
    current,
    last,
    start: total ? (current - 1) * pageSize + 1 : 0,
    end: Math.min(current * pageSize, total)
  };
};
