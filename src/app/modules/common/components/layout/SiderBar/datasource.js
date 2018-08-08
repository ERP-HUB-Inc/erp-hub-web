/*==============================POS===================================*/

// TRANSACTION
import SaleHistory from "../../../../pos/containers/transactions/SaleHistory";
import SaleOrder from "../../../../pos/containers/transactions/SaleOrder";
import ReturnExchange from "../../../../pos/containers/transactions/ReturnExchange";

// PRODUCT
import ManageProduct from "../../../../pos/containers/products/ManageProduct";
import Brand from "../../../../pos/containers/products/Brand";
import ProductType from "../../../../pos/containers/products/ProductType";
import ProductTag from "../../../../pos/containers/products/ProductTag";
import PrintPriceTag from "../../../../pos/containers/products/PrintPriceTag";
import ProductUnit from "../../../../pos/containers/products/ProductUnit";
import PriceBook from "../../../../pos/containers/products/PriceBook";
import Promotion from "../../../../pos/containers/products/Promotion";

// STOCK CONTROL
import Stock from "../../../../pos/containers/stock/Stock";
import StockControl from "../../../../pos/containers/stock/StockControl";
import ReOrderPoint from "../../../../pos/containers/stock/ReOrderPoint";
import PurchaseOrder from "../../../../pos/containers/stock/PurchaseOrder";
import StockReturn from "../../../../pos/containers/stock/StockReturn";
import StockTransfer from "../../../../pos/containers/stock/StockTransfer";
import StockAudit from "../../../../pos/containers/stock/StockAudit";
import Supplier from "../../../../pos/containers/stock/Supplier";

// REPORT
import SaleReport from "../../../../pos/containers/reports/Sale";
import PurchaseReport from "../../../../pos/containers/reports/Purchase";
import ProductReport from "../../../../pos/containers/reports/Product";
import InventoryReport from "../../../../pos/containers/reports/Inventory";
import PaymentReport from "../../../../pos/containers/reports/Payment";
import ProfitAndLostReport from "../../../../pos/containers/reports/ProfitAndLost";
import TaxReport from "../../../../pos/containers/reports/Tax";

// SETTING
import StoreAccount from "../../../../pos/containers/settings/StoreAccount";
import StoreLocation from "../../../../pos/containers/settings/StoreLocation";
import Tax from "../../../../pos/containers/settings/Tax";
import ReceiptTemplate from "../../../../pos/containers/settings/ReceiptTemplate";
import PaymentMethod from "../../../../pos/containers/settings/PaymentMethod";
import RoleAccess from "../../../../pos/containers/settings/RoleAccess";
import IncomeAndExpense from "../../../../pos/containers/settings/IncomeAndExpense";
import Currency from "../../../../pos/containers/settings/Currency";
import StoreLanguage from "../../../../pos/containers/settings/StoreLanguage";
import OperationRecord from "../../../../pos/containers/settings/OperationRecord";

/*==============================END POS===================================*/

/*==============================HR===================================*/

// EMPLOYEE
import ManageEmployee from "../../../../hr/containers/employees/ManageEmployee";
import Performance from "../../../../hr/containers/employees/Performance";
import TimeSheet from "../../../../hr/containers/employees/TimeSheet";

/*==============================END HR===================================*/


/*==============================CRM===================================*/

// CUSTOMER
// import GroupCustomer from "../../../../crm/containers/customers/GroupCustomer";
// import ManageCustomer from "../../../../crm/containers/customers/ManageCustomer";
// import PurchaseHistory from "../../../../crm/containers/customers/PurchaseHistory";
// import GroupCustomer from "../../../../crm/containers/employees/ManageEmployee";
// import ManageCustomer from "../../../../crm/containers/employees/ManageEmployee";
// import PurchaseHistory from "../../../../crm/containers/employees/ManageEmployee";

/*==============================END CRM===================================*/


/*==============================COMMON===================================*/
// SETTING

/*==============================END COMMON===================================*/

import React from "react";
import { Translate } from "react-localize-redux";

const dataSource = {
  transactions: {
    icon: "icon-list",
	route: "transactions",
    subItems: [
      {
        title: <Translate id="text_sale_history" />,
        icon: "icon-time",
        route: "/transactions/sale-history",
        component: SaleHistory
      },
      {
        title: <Translate id="text_sale_order" />,
        icon: "icon-pre-order",
        route: "/transactions/sale-order",
        component: SaleOrder
      },
      {
        title: <Translate id="text_return_exchange" />,
        icon: "icon-sale-return",
        route: "/transactions/return-exchange",
        component: ReturnExchange
      }
    ]
  },
  products: {
    icon: "icon-items",
	route: "products",
    subItems: [
      {
        title: "Manage Products",
        icon: "icon-time",
        route: "/products/return-exchange",
        component: ManageProduct
      },
      {
        title: "Brands",
        icon: "icon-brand",
        route: "/products/brand",
        component: Brand
      },
      {
        title: "Product Types",
        icon: "icon-types",
        route: "/products/types",
        component: ProductType
      },
      {
        title: "Product Tags",
        icon: "icon-tags",
        route: "/products/tags",
        component: ProductTag
      },
      {
        title: "Print Price Tags",
        icon: "icon-price-book",
        route: "/products/price-tags",
        component: PrintPriceTag
      },
      {
        title: "Manage Units",
        icon: "icon-price-book",
        route: "/products/units",
        component: ProductUnit
      },
      {
        title: "Price Books",
        icon: "icon-price-book",
        route: "/products/price-books",
        component: PriceBook
      },
      {
        title: "Promotions",
        icon: "icon-promotion",
        route: "/products/promotion",
        component: Promotion
      }
    ]
  },
  stocks: {
    icon: "icon-stock",
	route: "stock",
    subItems: [
      {
        title: "Stock",
        icon: "icon-stock",
        route: "/stock",
        component: Stock
      },
      {
        title: "Stock Control",
        icon: "icon-barcode",
        route: "/stock/control",
        component: StockControl
      },
      {
        title: "Re-Order Point",
        icon: "icon-undo",
        route: "/stock/re-order-point",
        component: ReOrderPoint
      },
      {
        title: "Purchase Orders",
        icon: "icon-purchasing",
        route: "/stock/purchase-order",
        component: PurchaseOrder
      },
      {
        title: "Stock Return",
        icon: "icon-sale-return",
        route: "/stock/return",
        component: StockReturn
      },
      {
        title: "Stock Transfer",
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer
      },
      {
        title: "Stock Audit",
        icon: "icon-stock-audit",
        route: "/stock/return",
        component: StockAudit
      },
      {
        title: "Supplier",
        icon: "icon-sale-return",
        route: "/stock/supplier",
        component: Supplier
      }
    ]
  },
  // customers: {
  //   icon: "icon-customer",
  //   subItems: [
  //     {
  //       title: "Group Customer",
  //       icon: "icon-employee",
  //       route: "/customers/group",
  //       component: GroupCustomer
  //     },
  //     {
  //       title: "Manage Customer",
  //       icon: "icon-customer ",
  //       route: "/customers/manage",
  //       component: ManageCustomer
  //     },
  //     {
  //       title: "Purchase History",
  //       icon: "icon-time",
  //       route: "/customers/history",
  //       component: PurchaseHistory
  //     }
  //   ]
  // },
  employees: {
    icon: "icon-employee",
	route: "employees",
    subItems: [
      {
        title: "Manage Employee",
        icon: "icon-employee",
        route: "/employees/manage",
        component: ManageEmployee
      },
      {
        title: "Timesheets",
        icon: "icon-timesheet",
        route: "/employees/timesheet",
        component: TimeSheet
      },
      {
        title: "Performance",
        icon: "icon-performance",
        route: "/employees/performance",
        component: Performance
      }
    ]
  },
  reports: {
    icon: "icon-reports",
	route: "reports",
    subItems: [
      {
        title: "Sale Report",
        icon: "icon-sale-report",
        route: "/reports/sale",
        component: SaleReport
      },
      {
        title: "Purchase Report",
        icon: "icon-purchasing",
        route: "/reports/purchase",
        component: PurchaseReport
      },
      {
        title: "Products Report",
        icon: "icon-items",
        route: "/reports/product",
        component: ProductReport
      },
      {
        title: "Inventory Report",
        icon: "icon-stock",
        route: "/reports/inventory",
        component: InventoryReport
      },
      {
        title: "Payment Report",
        icon: "icon-payment-report",
        route: "/reports/payment",
        component: PaymentReport
      },
      {
        title: "Profit & Lost Report",
        icon: "icon-sale-return",
        route: "/reports/profit-lost",
        component: ProfitAndLostReport
      },
      {
        title: "Profit & Lost Report",
        icon: "icon-reports",
        route: "/reports/profit-lost",
        component: ProfitAndLostReport
      },
      {
        title: "Tax Report",
        icon: "icon-tax-report",
        route: "/reports/tax",
        component: TaxReport
      }
    ]
  },
  settings: {
    icon: "icon-settings",
	route: "settings",
    subItems: [
      {
        title: "Store Account",
        icon: "icon-account",
        route: "/settings/account",
        component: StoreAccount,
        isFashNav: true
      },
      {
        title: "Store Location",
        icon: "icon-store",
        route: "/settings/location",
        component: StoreLocation,
        isFashNav: false
      },
      {
        title: "Receipt Template",
        icon: "icon-receipt",
        route: "/settings/receipt-template",
        component: ReceiptTemplate,
        isFashNav: true
      },
      {
        title: "Payment Method",
        icon: "icon-payment-method",
        route: "/settings/payment-method",
        component: PaymentMethod,
        isFashNav: false
      },
      {
        title: "Tax",
        icon: "icon-tax",
        route: "/settings/tax",
        component: Tax,
        isFashNav: true
      },
      {
        title: "Role Access",
        icon: "icon-role",
        route: "/settings/role",
        component: RoleAccess,
        isFashNav: true
      },
      {
        title: "Income & Expense",
        icon: "icon-operation",
        route: "/settings/income-expense",
        component: IncomeAndExpense,
        isFashNav: false
      },
      {
        title: "Currency",
        icon: "icon-currency",
        route: "/settings/currency",
        component: Currency,
        isFashNav: false
      },
      {
        title: "Language",
        icon: "icon-language",
        route: "/settings/language",
        component: StoreLanguage,
        isFashNav: false
      },
      {
        title: "Operation Record",
        icon: "icon-language",
        route: "/settings/operation-record",
        component: OperationRecord,
        isFashNav: true
      }
    ]
  }
};

export default dataSource;