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

/*==============================END POS===================================*/

/*==============================HR===================================*/

// EMPLOYEE
import ManageEmployee from "../../../../hr/containers/employees/ManageEmployee";
import Performance from "../../../../hr/containers/employees/Performance";
import TimeSheet from "../../../../hr/containers/employees/TimeSheet";

/*==============================END HR===================================*/


/*==============================CRM===================================*/

// CUSTOMER
import GroupCustomer from "../../../../crm/containers/customers/GroupCustomer";
import ManageCustomer from "../../../../crm/containers/customers/ManageCustomer";
import PurchaseHistory from "../../../../crm/containers/customers/PurchaseHistory";

/*==============================END CRM===================================*/


/*==============================COMMON===================================*/
// SETTING

/*==============================END COMMON===================================*/

import React from "react";
import { Translate } from "react-localize-redux";

const dataSource = {
  transactions: {
    icon: "icon-list",
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
    subItems: [
      {
        title: "Stock",
        icon: "icon-time",
        route: "/stock",
        component: Stock
      },
      {
        title: "Stock Control",
        icon: "icon-pre-order",
        route: "/stock/control",
        component: StockControl
      },
      {
        title: "Re-Order Point",
        icon: "icon-sale-return",
        route: "/stock/re-order-point",
        component: ReOrderPoint
      },
      {
        title: "Purchase Orders",
        icon: "icon-sale-return",
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
        icon: "icon-sale-return",
        route: "/stock/transfer",
        component: StockTransfer
      },
      {
        title: "Stock Audit",
        icon: "icon-sale-return",
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
  customers: {
    icon: "icon-customer",
    subItems: [
      {
        title: "Group Customer",
        icon: "icon-time",
        route: "/customers/group",
        component: GroupCustomer
      },
      {
        title: "Manage Customer",
        icon: "icon-pre-order",
        route: "/customers/manage",
        component: ManageCustomer
      },
      {
        title: "Purchase History",
        icon: "icon-sale-return",
        route: "/customers/history",
        component: PurchaseHistory
      }
    ]
  },
  employees: {
    icon: "icon-employee",
    subItems: [
      {
        title: "Manage Employee",
        icon: "icon-time",
        route: "/employees/manage",
        component: ManageEmployee
      },
      {
        title: "Timesheets",
        icon: "icon-pre-order",
        route: "/employees/timesheet",
        component: TimeSheet
      },
      {
        title: "Performance",
        icon: "icon-sale-return",
        route: "/employees/performance",
        component: Performance
      }
    ]
  },
  reports: {
    icon: "icon-reports",
    subItems: [
      {
        title: "Sale Report",
        icon: "icon-time",
        route: "/reports/sale",
        component: SaleReport
      },
      {
        title: "Purchase Report",
        icon: "icon-pre-order",
        route: "/reports/purchase",
        component: PurchaseReport
      },
      {
        title: "Products Report",
        icon: "icon-sale-return",
        route: "/reports/product",
        component: ProductReport
      },
      {
        title: "Inventory Report",
        icon: "icon-sale-return",
        route: "/reports/inventory",
        component: InventoryReport
      },
      {
        title: "Payment Report",
        icon: "icon-sale-return",
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
        icon: "icon-sale-return",
        route: "/reports/profit-lost",
        component: ProfitAndLostReport
      },
      {
        title: "Tax Report",
        icon: "icon-sale-return",
        route: "/reports/tax",
        component: TaxReport
      }
    ]
  },
  settings: {
    icon: "icon-settings",
    subItems: [
      {
        title: "Store Account",
        icon: "icon-time",
        route: "/settings/account",
        component: StoreAccount
      },
      {
        title: "Store Location",
        icon: "icon-pre-order",
        route: "/settings/location",
        component: StoreLocation
      },
      {
        title: "Receipt Template",
        icon: "icon-sale-return",
        route: "/settings/receipt-template",
        component: ReceiptTemplate
      },
      {
        title: "Payment Method",
        icon: "icon-sale-return",
        route: "/settings/payment-method",
        component: PaymentMethod
      },
      {
        title: "Tax",
        icon: "icon-sale-return",
        route: "/settings/tax",
        component: Tax
      },
      {
        title: "Role",
        icon: "icon-sale-return",
        route: "/settings/role",
        component: RoleAccess
      },
      {
        title: "Income & Expense",
        icon: "icon-sale-return",
        route: "/settings/income-expense",
        component: IncomeAndExpense
      },
      {
        title: "Currency",
        icon: "icon-sale-return",
        route: "/settings/currency",
        component: Currency
      },
      {
        title: "Store Language",
        icon: "icon-sale-return",
        route: "/settings/language",
        component: StoreLanguage
      }
    ]
  }
};

export default dataSource;