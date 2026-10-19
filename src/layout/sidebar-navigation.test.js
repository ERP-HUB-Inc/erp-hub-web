import { getSidebarDefaultKeys } from "./sidebar-navigation";

test.each([
  ["/", "1", []],
  ["/sales/update/42", "21", ["2"]],
  ["/transactions/sale-order/detail/42", "21", ["2"]],
  ["/customers", "24", ["2"]],
  ["/purchase-orders/create", "31", ["3"]],
  ["/vendors/update/42", "33", ["3"]],
  ["/inventories/items/view/42", "41", ["4"]],
  ["/inventories/stock-io/create", "42", ["4"]],
  ["/general-ledger", "51", ["5"]],
  ["/accounts-receivable", "52", ["5"]],
  ["/accounts-payable", "53", ["5"]],
  ["/reports/sales-report", "61", ["6"]],
  ["/reports/purchases", "62", ["6"]],
  ["/reports/stock", "63", ["6"]],
  ["/reports/items", "64", ["6"]],
  ["/reports/financial", "65", ["6"]],
  ["/settings", "7", []]
])("keeps selection and submenu for %s", (path, selectedKey, openKeys) => {
  expect(getSidebarDefaultKeys(path)).toEqual({ selectedKeys: [selectedKey], openKeys });
});

test("selects User Management for the existing users settings tab only", () => {
  expect(getSidebarDefaultKeys("/settings", "?tab=users").selectedKeys).toEqual(["8"]);
  expect(getSidebarDefaultKeys("/settings", "?tab=logs").selectedKeys).toEqual(["7"]);
  expect(getSidebarDefaultKeys("/settings", "?filter=users").selectedKeys).toEqual(["7"]);
});

test("matches route segments rather than similarly named paths", () => {
  expect(getSidebarDefaultKeys("/vendors-other").selectedKeys).toEqual(["1"]);
});
