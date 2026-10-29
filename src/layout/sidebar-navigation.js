export const sidebarMenuRoutes = [
  { path: "/", selectedKey: "1" },
  { path: "/sales", selectedKey: "21", openKey: "2" },
  { path: "/transactions/sale-order", selectedKey: "21", openKey: "2" },
  { path: "/customers", selectedKey: "24", openKey: "2" },
  { path: "/customer-profile", selectedKey: "24", openKey: "2" },
  { path: "/purchase-orders", selectedKey: "31", openKey: "3" },
  { path: "/vendors", selectedKey: "33", openKey: "3" },
  { path: "/inventories/items", selectedKey: "41", openKey: "4" },
  { path: "/inventories/stock-io", selectedKey: "42", openKey: "4" },
  { path: "/inventories/transfers", selectedKey: "42", openKey: "4" },
  { path: "/inventories/adjustments", selectedKey: "42", openKey: "4" },
  { path: "/general-ledger", selectedKey: "51", openKey: "5" },
  { path: "/accounts-receivable", selectedKey: "52", openKey: "5" },
  { path: "/accounts-payable", selectedKey: "53", openKey: "5" },
  { path: "/finance/expenses", selectedKey: "54", openKey: "5" },
  { path: "/reports/sales-report", selectedKey: "61", openKey: "6" },
  { path: "/reports/purchases", selectedKey: "62", openKey: "6" },
  { path: "/reports/stock", selectedKey: "63", openKey: "6" },
  { path: "/reports/items", selectedKey: "64", openKey: "6" },
  { path: "/reports/financial", selectedKey: "65", openKey: "6" },
  { path: "/settings", tab: "users", selectedKey: "8" },
  { path: "/settings", selectedKey: "7" },
];

export function getSidebarDefaultKeys(pathname, search = "") {
  const currentPath = pathname || "/";
  const tab = new URLSearchParams(search).get("tab");
  const matchedRoute = sidebarMenuRoutes
    .filter(route => !route.tab || route.tab === tab)
    .filter(route => currentPath === route.path || (route.path !== "/" && currentPath.indexOf(`${route.path}/`) === 0))
    .sort((firstRoute, secondRoute) => secondRoute.path.length - firstRoute.path.length)[0] || sidebarMenuRoutes[0];

  return {
    selectedKeys: [matchedRoute.selectedKey],
    openKeys: matchedRoute.openKey ? [matchedRoute.openKey] : [],
  };
}

