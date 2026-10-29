// Route sources: src/layout/main-app.jsx and
// src/app/modules/common/router/index.js. Keep current and legacy routes distinct.
export const routes = {
  login: "/login",
  dashboard: "/",
  items: "/inventories/items",
  createItem: "/inventories/items/create",
  editItem: id => `/inventories/items/update/${encodeURIComponent(id)}`,
  categories: "/settings/categories",
  createCategory: "/settings/categories/create",
  brands: "/settings/brands",
  createBrand: "/settings/brands/create",
  itemTypes: "/settings/item-types",
  units: "/settings/units",
  locations: "/settings/locations",
  options: "/settings/options",
  purchaseOrders: "/purchase-orders",
  createPurchaseOrder: "/purchase-orders/create",
  stockIO: "/inventories/stock-io",
  createStockIO: "/inventories/stock-io/create",
  retailPOS: "/pos",
  salesReport: "/reports/sales-report",
  purchaseReport: "/reports/purchases"
};
