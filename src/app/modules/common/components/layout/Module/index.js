import React from "react";
import { Translate } from "react-localize-redux";
import Loadable from "react-loadable";
import StartUp from "../../StartUp";

export const modules = {
  // TRANSACTION MODULE
  Transaction: {
    icon: "icon-list",
    route: "transactions",
    title: <Translate id="text_transaction" />
  },
  SaleHistory: {
    title: <Translate id="text_sale_history" />,
    icon: "icon-time",
    route: "/transactions/salehistory",
    component: loadComponet(import("../../../../pos/containers/transactions/SaleHistory")),
    parent: "Transaction",
    isFashNav: true
  },
  SaleOrder: {
    title: <Translate id="text_sale_order" />,
    icon: "icon-pre-order",
    route: "/transactions/pos",
    component: loadComponet(import("../../../../pos/containers/transactions/SaleWalkin")),
    parent: "Transaction",
    isFashNav: true
  },
  CloseShift: {
    title: <Translate id="text_close_shift" />,
    icon: "icon-currency",
    route: "/transactions/saleregister",
    component: loadComponet(import("../../../../pos/containers/transactions/OpenSaleRegistration")),
    parent: "Transaction",
    isFashNav: true
  },

  // PRODUCT MODULE
  ManageProduct: {
    icon: "icon-items",
    route: "products",
    title: <Translate id="text_product" />
  },
  Product: {
    title:  <Translate id="text_manage_product" />,
    icon: "icon-time",
    route: "/products/brand",
    component: loadComponet(import("../../../../inventory/containers/products/Product")),
    parent: "ManageProduct",
    isFashNav: true
  },
  Brand: {
    title:  <Translate id="text_brand" />,
    icon: "icon-brand",
    route: "/products/brand",
    component: loadComponet(import("../../../../inventory/containers/products/Brand")),
    parent: "ManageProduct",
    isFashNav: true
  },
  ProductType: {
    title: <Translate id="text_category" />,
    icon: "icon-types",
    route: "/products/types",
    component: loadComponet(import("../../../../inventory/containers/products/ProductsType")),
    parent: "ManageProduct",
    isFashNav: true
  },
  ProductsTag: {
    title: <Translate id="text_product_tags" />,
    icon: "icon-tags",
    route: "/products/tags",
    component: loadComponet(import("../../../../inventory/containers/products/ProductsTag")),
    parent: "ManageProduct"
  },
  PrintPriceTag: {
    title: <Translate id="text_print_price_tags" />,
    icon: "icon-price-book",
    route: "/products/price-tags",
    component: loadComponet(import("../../../../inventory/containers/products/PrintPriceTag")),
    parent: "ManageProduct"
  },
  ProductsUnit: {
    title: <Translate id="text_manage_unit" />,
    icon: "icon-price-book",
    route: "/products/units",
    component: loadComponet(import("../../../../inventory/containers/products/ProductsUnit")),
    parent: "ManageProduct"
  },

  // STOCK MODULE
  Stock: {
    icon: "icon-stock",
    route: "stock",
    title: <Translate id="text_stock" />
  },
  Supplier: {
    title: <Translate id="text_supplier" />,
    icon: "icon-customer",
    route: "/stock/supplier",
    component: loadComponet(import("../../../../inventory/containers/stock/Supplier")),
    parent: "Stock"
  },
  PurchaseOrder: {
    title: <Translate id="text_purchase_order" />,
    icon: "icon-purchasing",
    route: "/stock/purchase/order",
    component: loadComponet(import("../../../../inventory/containers/stock/PurchaseOrder")),
    parent: "Stock",
    isFashNav: true
  },
  ReceiveOrder: {
    title: <Translate id="text_receive_purchase" />,
    icon: "icon-import",
    route: "/stock/purchase/receive",
    component: loadComponet(import("../../../../inventory/containers/stock/ReceivePurchase")),
    parent: "Stock"
  },
  StockReturn: {
    title: <Translate id="text_return_purchase" />,
    icon: "icon-sale-return",
    route: "/stock/return",
    component: loadComponet(import("../../../../inventory/containers/stock/ReturnPurchase")),
    parent: "Stock"
  },
  StockTransfer: {
    title: <Translate id="text_receive_transfer" />,
    icon: "icon-import",
    route: "/stock/receive/transfer",
    component: loadComponet(import("../../../../inventory/containers/stock/ReceiveStockTransfer")),
    parent: "Stock"
  },
  StockAdjustmentRequest: {
    title: <Translate id="text_stock_adjustment" />,
    icon: "icon-stock-audit",
    route: "/stock/adjustment/request",
    component: loadComponet(import("../../../../inventory/containers/stock/StockAdjustmentRequest")),
    parent: "Stock"
  },
  StockAdjustmentApprove: {
    title: <Translate id="text_adjustment_approve" />,
    icon: "icon-import",
    route: "/stock/adjustment/approve",
    component: loadComponet(import("../../../../inventory/containers/stock/StockAdjustmentApprove")),
    parent: "Stock"
  },

  // REPORT MODULE
  Report: {
    icon: "icon-reports",
    route: "reports",
    title: <Translate id="text_report" />
  },
  SaleReport: {
    title: <Translate id="text_sale_report" />,
    icon: "icon-sale-report",
    route: "/reports/sale",
    component: loadComponet(import("../../../../pos/containers/reports/Sale/ReportSaleSummary")),
    parent: "Report"
  },
  ProductReport: {
    title: <Translate id="text_product_report" />,
    icon: "icon-items",
    route: "/reports/product",
    component: loadComponet(import("../../../../pos/containers/reports/Product")),
    parent: "Report"
  },
  ProfitAndLostReport: {
    title: <Translate id="text_profit_and_loss_report" />,
    icon: "icon-sale-return",
    route: "/reports/profit-lost",
    component: loadComponet(import("../../../../pos/containers/reports/ProfitAndLost")),
    parent: "Report"
  },

  // SETTING
  Setting: {
    icon: "icon-settings",
    route: "settings",
    title: <Translate id="text_setting" />
  },
  StoreAccount: {
    title: <Translate id="text_store_account" />,
    icon: "icon-account",
    route: "/settings/account",
    component: loadComponet(import("../../../../pos/containers/settings/StoreAccount")),
    parent: "Setting",
    isFashNav: true
  },
  StoreLocation: {
    title: <Translate id="text_location" />,
    icon: "icon-store",
    route: "/settings/location",
    component: loadComponet(import("../../../../pos/containers/settings/StoreLocation")),
    parent: "Setting",
    isFashNav: true
  },
  Tax: {
    title: <Translate id="text_tax" />,
    icon: "icon-taxes",
    route: "/settings/tax",
    component: loadComponet(import("../../../../pos/containers/settings/Tax")),
    parent: "Setting",
    isFashNav: true
  },
  ReceiptTemplate: {
    title: <Translate id="text_receipt_template" />,
    icon: "icon-receipt",
    route: "/settings/receipt/template",
    component: loadComponet(import("../../../../pos/containers/settings/ReceiptTemplate")),
    parent: "Setting",
    isFashNav: true
  },
  PaymentMethod: {
    title: <Translate id="text_payment_method" />,
    icon: "icon-payment-method",
    route: "/settings/payment-method",
    component: loadComponet(import("../../../../pos/containers/settings/PaymentMethod")),
    parent: "Setting"
  },
  RoleAccess: {
    title: <Translate id="text_role_access" />,
    icon: "icon-role",
    route: "/settings/role",
    component: loadComponet(import("../../../../pos/containers/settings/RoleAccess")),
    parent: "Setting"
  },
  Currency: {
    title: <Translate id="text_currency" />,
    icon: "icon-currency",
    route: "/settings/currency",
    component: loadComponet(import("../../../../pos/containers/settings/Currency")),
    parent: "Setting"
  },
  CurrencyExchange: {
    title: <Translate id="currency_exchange" />,
    icon: "icon-operation",
    route: "/settings/currency-exchange",
    component: loadComponet(import("../../../../pos/containers/settings/CurrencyExchange")),
    parent: "Setting"
  },
  StoreLanguage: {
    title: <Translate id="text_language" />,
    icon: "icon-language",
    route: "/settings/language",
    component: loadComponet(import("../../../../pos/containers/settings/StoreLanguage")),
    parent: "Setting"
  },
  OperationRecord: {
    title: <Translate id="operation_record_title" />,
    icon: "icon-operation",
    route: "/settings/operation-record",
    component: loadComponet(import("../../../../pos/containers/settings/OperationRecord")),
    parent: "Setting"
  },

  // HR MODULE
  Employee: {
    icon: "icon-employee",
    route: "employees",
    title: <Translate id="text_employee" />
  },
  ManageEmployee: {
    title: <Translate id="text_manage_employee" />,
    icon: "icon-employee",
    route: "/employee",
    component: loadComponet(import("../../../../hr/containers/employees/Employee")),
    parent: "Employee"
  },

  // CUSTOMER MODULE
  Customer: {
    icon: "icon-customer",
    route: "customers",
    title: <Translate id="text_customer" />
  },
  GroupCustomer: {
    title: <Translate id="text_group_customer" />,
    icon: "icon-employee",
    route: "/customers/group",
    component: loadComponet(import("../../../../crm/containers/customers/Group")),
    parent: "Customer"
  },
  ManageCustomer: {
    title: <Translate id="text_manage_customer" />,
    icon: "icon-customer ",
    route: "/customer",
    component: loadComponet(import("../../../../crm/containers/customers/Customer")),
    parent: "Customer"
  }
};

function loadComponet(path) {
  return Loadable({
    loader: () => path,
    loading: () => <StartUp />
  });
}