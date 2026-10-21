import moment from "moment";

export const numberOrNull = (value) => (value === null || value === undefined || value === "" || typeof value === "boolean" || !Number.isFinite(Number(value)) ? null : Number(value));
export const payloadOf = (response) => (response && response.data && response.data.data !== undefined ? response.data.data : response && response.data);
export const rowsOf = (value) => (Array.isArray(value) ? value : value && Array.isArray(value.data) ? value.data : []);
export const percent = (value, total) => {
  const amount = numberOrNull(value), base = numberOrNull(total);
  return amount === null || base === null || base <= 0 ? null : (amount / base) * 100;
};
export const changePercent = (value, previous) => {
  const current = numberOrNull(value), baseline = numberOrNull(previous);
  if (current === null || baseline === null) return null;
  if (baseline === 0) return current === 0 ? 0 : null;
  return ((current - baseline) / Math.abs(baseline)) * 100;
};
export const periodOptions = [
  ["today", "Today"],
  ["yesterday", "Yesterday"],
  ["this-week", "This Week"],
  ["last-week", "Last Week"],
  ["this-month", "This Month"],
  ["last-month", "Last Month"],
  ["last-7-day", "Last 7 Days"],
  ["last-30-days", "Last 30 Days"],
  ["previous-quarter", "Previous Quarter"],
  ["this-year", "This Year"],
  ["previous-year", "Previous Year"],
  ["last-12-months", "Last 12 Months"],
  ["last-3-months", "Last 3 Months"],
];
export function businessDate(now, timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function resolvePeriod(key, now, timeZone) {
  const today = moment.utc(businessDate(now, timeZone));
  let start = today.clone(),
    end = today.clone();
  switch (key) {
    case "yesterday":
      start.subtract(1, "day");
      end.subtract(1, "day");
      break;
    case "this-week":
      start.startOf("isoWeek");
      break;
    case "last-week":
      start.subtract(1, "week").startOf("isoWeek");
      end = start.clone().endOf("isoWeek");
      break;
    case "this-month":
      start.startOf("month");
      break;
    case "last-month":
      start.subtract(1, "month").startOf("month");
      end = start.clone().endOf("month");
      break;
    case "last-7-day":
      start.subtract(6, "days");
      break;
    case "last-30-days":
      start.subtract(29, "days");
      break;
    case "previous-quarter":
      start.subtract(1, "quarter").startOf("quarter");
      end = start.clone().endOf("quarter");
      break;
    case "this-year":
      start.startOf("year");
      break;
    case "previous-year":
      start.subtract(1, "year").startOf("year");
      end = start.clone().endOf("year");
      break;
    case "last-12-months":
      start.subtract(11, "months").startOf("month");
      break;
    case "last-3-months":
      start.subtract(2, "months").startOf("month");
      break;
    default:
      break;
  }
  const days = end.diff(start, "days") + 1;
  return {
    fromDate: start.format("YYYY-MM-DD"),
    toDate: end.format("YYYY-MM-DD"),
    previousFrom: start.clone().subtract(days, "days").format("YYYY-MM-DD"),
    previousTo: start.clone().subtract(1, "day").format("YYYY-MM-DD"),
    groupBy: days > 90 ? "MONTH" : "DAY",
    today: today.format("YYYY-MM-DD"),
    monthStart: today.clone().startOf("month").format("YYYY-MM-DD"),
  };
}
export function coverageMetrics(profit, expenses) {
  const grossProfit = numberOrNull(profit), operatingExpenses = numberOrNull(expenses);
  if (grossProfit === null || operatingExpenses === null) return { coverage: null, result: null, shortfall: null, profitBar: 0, expenseBar: 0 };
  const scale = Math.max(Math.abs(grossProfit), Math.abs(operatingExpenses), 1);
  return {
    coverage: percent(grossProfit, operatingExpenses),
    result: grossProfit - operatingExpenses,
    shortfall: Math.max(operatingExpenses - grossProfit, 0),
    profitBar: (Math.max(grossProfit, 0) / scale) * 100,
    expenseBar: (Math.max(operatingExpenses, 0) / scale) * 100,
  };
}
export function chartRows(value, today) {
  return rowsOf(value)
    .filter((row) => typeof row.period === "string" && row.period.slice(0, 10) <= today)
    .map((row) => {
      const revenue = numberOrNull(row.salesRevenue), cost = numberOrNull(row.salesCost);
      return {
        ...row,
        salesRevenue: revenue,
        salesCost: cost,
        grossProfit: revenue === null || cost === null ? null : revenue - cost,
      };
    });
}
export function productMetrics(value, totalRevenue) {
  const rows = rowsOf(value);
  const amounts = rows.map((row) => numberOrNull(row.salesRevenue));
  const total = amounts.every((amount) => amount !== null) ? amounts.reduce((sum, amount) => sum + amount, 0) : null;
  return { rows, total, share: percent(total, totalRevenue) };
}
