import moment from "moment";
import Util from "../../../../common/util";
import PurchaseService from "../../../services/report/PurchaseService";
import { finiteNumber } from "./costChangesModel";

const util = new Util();
export const pathName = "/reports/purchase-report";
export const pageSize = 20;

const readNonNegativeNumber = (params, key, fallback) => {
  const value = params.get(key);
  const parsed = Number(value);
  return value !== null && value !== "" && Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : fallback;
};

export const initialFilters = () => {
  const params = new URLSearchParams(document.location.search);
  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");
  const minChangePercent = finiteNumber(params.get("minChangePercent"));
  const today = moment();
  const monthStart = today.clone().startOf("month").format("YYYY-MM-DD");
  const monthEnd = today.clone().endOf("month").format("YYYY-MM-DD");
  const validFrom = fromDate && moment(fromDate, "YYYY-MM-DD", true).isValid()
    ? fromDate
    : monthStart;
  const validTo = toDate && moment(toDate, "YYYY-MM-DD", true).isValid()
    ? toDate
    : monthEnd;
  const invalidRange = moment(validFrom).isAfter(moment(validTo));

  return {
    fromDate: invalidRange ? monthStart : validFrom,
    toDate: invalidRange ? monthEnd : validTo,
    locationId: params.get("locationId") || "",
    supplierId: params.get("supplierId") || "",
    minChangePercent: minChangePercent === null ? 5 : minChangePercent,
    thresholdDays: readNonNegativeNumber(params, "thresholdDays", 60)
  };
};

const number = value => Number(value || 0);
const isMissing = value => value === null || value === undefined;
export const quantity = value => isMissing(value) ? "-" : number(value).toLocaleString();
const money = value => isMissing(value) ? "-" : util.formatCurrency(number(value));
const percent = value => isMissing(value) ? "-" : `${number(value).toFixed(2)}%`;
const display = value => isMissing(value) || value === "" ? "-" : value;

export const unwrap = response => {
  const payload = response && response.data ? response.data : {};
  return payload.data && !Array.isArray(payload.data) ? payload.data : payload;
};

export const rowsOf = payload => {
  if (Array.isArray(payload)) return payload;

  for (const key of ["items", "data", "products", "suppliers", "trend"]) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  return [];
};

const product = (value, record) => {
  const name = (value || record.itemName || record.name || "").trim();
  const variantName = (record.variantName || "").trim();
  return display([name, variantName].filter(Boolean).join(" / "));
};

const textColumn = (title, key, render = display) => ({
  title,
  dataIndex: key,
  key,
  render
});

const numericColumn = (title, key, render = quantity) => ({
  ...textColumn(title, key, render),
  align: "right"
});

export const sections = {
  trend: {
    label: "Purchase Trend",
    description: "See monthly orders and received purchases over time.",
    fetch: option => PurchaseService.getPurchaseTrend(option),
    columns: [
      textColumn("Period", "period"),
      numericColumn("Orders", "orderCount"),
      numericColumn("Quantity", "quantity"),
      numericColumn("Shipping Fee", "shippingFee", money),
      numericColumn("Discount", "discount", money),
      numericColumn("Purchase Amount", "purchaseAmount", money)
    ]
  },
  products: {
    label: "Purchased Items",
    description: "Find the products consuming your purchasing budget.",
    fetch: option => PurchaseService.getPurchaseProducts(option),
    paged: true,
    columns: [
      { ...textColumn("Product / Variant", "itemName", product), width: 280 },
      textColumn("SKU", "sku"),
      numericColumn("Quantity", "quantity"),
      numericColumn("Received", "receiveQuantity"),
      numericColumn("Returned", "returnQuantity"),
      numericColumn("Pending", "pendingQuantity"),
      numericColumn("Purchase Amount", "purchaseAmount", money),
      numericColumn("Average Cost", "averageCost", money)
    ]
  },
  suppliers: {
    label: "Suppliers",
    description: "Compare spend, order volume, and purchase share by supplier.",
    fetch: option => PurchaseService.getPurchaseSuppliers(option),
    paged: true,
    columns: [
      textColumn("Supplier", "supplierName"),
      numericColumn("Orders", "orderCount"),
      numericColumn("Quantity", "quantity"),
      numericColumn("Purchase Amount", "purchaseAmount", money),
      numericColumn("Avg Order Value", "averageOrderValue", money)
    ]
  },
  priceIncrease: {
    label: "Cost Changes",
    description: "Compare weighted purchase costs with the previous comparable period.",
    fetch: option => PurchaseService.getPurchasePriceIncrease(option)
  },
  overstock: {
    label: "Stock Risk",
    description: "Review current stock against recent sales demand where inventory data is available.",
    fetch: option => PurchaseService.getPurchaseOverstock(option)
  },
  purchaseVsSales: {
    label: "Purchase vs Sales",
    description: "Compare period activity. A difference in quantities does not represent current stock.",
    fetch: option => PurchaseService.getPurchaseVsSales(option),
    paged: true,
    columns: [
      { ...textColumn("Product / Variant", "itemName", product), width: 280 },
      textColumn("SKU", "sku"),
      numericColumn("Purchased", "purchaseQuantity"),
      numericColumn("Sold", "salesQuantity"),
      numericColumn("Quantity Difference", "quantityDifference"),
      numericColumn("Purchase Amount", "purchaseAmount", money),
      numericColumn("Sales Amount", "salesAmount", money),
      numericColumn("Sales Cost", "salesCost", money),
      numericColumn("Gross Profit", "grossProfit", money),
      numericColumn("Amount Difference", "amountDifference", money),
      numericColumn("Purchase / Sales", "purchaseSalesRatio", percent),
      textColumn("Activity", "activityStatus")
    ]
  }
};

export const stats = [
  {
    title: "Orders",
    key: "totalOrders",
    icon: "profile",
    color: "is-blue",
    format: quantity
  },
  {
    title: "Purchase Amount",
    key: "totalPurchase",
    icon: "shopping-cart",
    color: "is-green",
    format: money
  },
  {
    title: "Quantity",
    key: "totalQuantity",
    icon: "database",
    color: "is-purple",
    format: quantity
  },
  {
    title: "Items",
    key: "totalItems",
    icon: "inbox",
    color: "is-teal",
    format: quantity
  },
  {
    title: "Shipping Fee",
    key: "totalShippingFee",
    icon: "wallet",
    color: "is-orange",
    format: money
  },
  {
    title: "Discount",
    key: "totalDiscount",
    icon: "tags",
    color: "is-red",
    format: money
  }
];
export const activityStats = [
  { title: "Products", key: "productCount", format: quantity },
  { title: "Purchase Quantity", key: "purchaseQuantity", format: quantity },
  { title: "Purchase Amount", key: "purchaseAmount", format: money },
  { title: "Sales Quantity", key: "salesQuantity", format: quantity },
  { title: "Sales Amount", key: "salesAmount", format: money },
  { title: "Sales Cost", key: "salesCost", format: money },
  { title: "Gross Profit", key: "grossProfit", format: money },
  { title: "Purchase / Sales", key: "purchaseSalesRatio", format: percent },
  { title: "Quantity Difference", key: "quantityDifference", format: quantity },
  { title: "Amount Difference", key: "amountDifference", format: money },
  { title: "Purchase Only", key: "purchaseOnlyProducts", format: quantity },
  { title: "Sales Only", key: "salesOnlyProducts", format: quantity },
  { title: "Purchase Ahead", key: "purchaseAheadProducts", format: quantity },
  { title: "Sales Ahead", key: "salesAheadProducts", format: quantity }
];


