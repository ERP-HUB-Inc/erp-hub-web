/*==============================POS===================================*/

// TRANSACTION
import SaleHistory from "../../../../pos/containers/transactions/SaleHistory";
import SaleOrder from "../../../../pos/containers/transactions/SaleOrder";
import ReturnExchange from "../../../../pos/containers/transactions/ReturnExchange";

// PRODUCT
import ManageProduct from "../../../../inventory/containers/products/Product";
import Brand from "../../../../inventory/containers/products/Brand";
import ProductType from "../../../../inventory/containers/products/ProductsType";
import ProductTag from "../../../../inventory/containers/products/productsTag";
import PrintPriceTag from "../../../../inventory/containers/products/PrintPriceTag";
import ProductUnit from "../../../../inventory/containers/products/ProductsUnit";
import PriceBook from "../../../../pos/containers/products/PriceBook";
import Promotion from "../../../../pos/containers/products/Promotion";

// STOCK CONTROL
import Stock from "../../../../inventory/containers/stock/stockManagement";
import StockControl from "../../../../pos/containers/stock/StockControl";
import ReOrderPoint from "../../../../inventory/containers/stock/reorderPoint";
import PurchaseOrder from "../../../../inventory/containers/stock/purchaseOrder";
import ReceiveOrder from "../../../../inventory/containers/stock/receivePurchase";
import StockReturn from "../../../../inventory/containers/stock/returnPurchase";
import StockTransfer from "../../../../inventory/containers/stock/stockTransfer";
import StockAudit from "../../../../pos/containers/stock/StockAudit";
import Supplier from "../../../../inventory/containers/stock/supplier";

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
import Currency from "../../../../pos/containers/settings/Currency";
import StoreLanguage from "../../../../pos/containers/settings/StoreLanguage";
import OperationRecord from "../../../../pos/containers/settings/OperationRecord";

/*==============================END POS===================================*/

/*==============================HR===================================*/

// EMPLOYEE
import ManageEmployee from "../../../../hr/containers/employees/ManageEmployee";
// import Performance from "../../../../hr/containers/employees/Performance";
// import TimeSheet from "../../../../hr/containers/employees/TimeSheet";

/*==============================END HR===================================*/


/*==============================CRM===================================*/

// CUSTOMER
import GroupCustomer from "../../../../crm/containers/customers/GroupCustomers";
import ManageCustomer from "../../../../crm/containers/customers/ManageCustomers";
// import PurchaseHistory from "../../../../crm/containers/customers/ManageCustomers";

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
        route: "/transactions/saleorder",
        component: SaleOrder
      },
      {
        title: <Translate id="text_return_exchange" />,
        icon: "icon-sale-return",
        route: "/transactions/return/exchange",
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
        route: "/products/manage",
        component: ManageProduct,
        isFashNav: true
      },
      {
        title: "Brands",
        icon: "icon-brand",
        route: "/products/brand",
        component: Brand,
        isFashNav: true
      },
      {
        title: "Product Types",
        icon: "icon-types",
        route: "/products/types",
        component: ProductType,
        isFashNav: true
      },
      {
        title: "Product Tags",
        icon: "icon-tags",
        route: "/products/tags",
        component: ProductTag,
        isFashNav: true
      },
      {
        title: "Print Price Tags",
        icon: "icon-price-book",
        route: "/products/price-tags",
        component: PrintPriceTag,
        isFashNav: true
      },
      {
        title: "Manage Units",
        icon: "icon-price-book",
        route: "/products/units",
        component: ProductUnit,
        isFashNav: true
      },
      {
        title: "Price Books",
        icon: "icon-price-book",
        route: "/products/price-books",
        component: PriceBook,
        isFashNav: true
      },
      {
        title: "Promotions",
        icon: "icon-promotion",
        route: "/products/promotion",
        component: Promotion,
        isFashNav: true
      }
    ]
  },
  stocks: {
    icon: "icon-stock",
    route: "stock",
    subItems: [
      {
        title: "Supplier",
        icon: "icon-sale-return",
        route: "/stock/supplier",
        component: Supplier,
        isFashNav: true
      },
      {
        title: "Purchase Orders",
        icon: "icon-purchasing",
        route: "/stock/purchase/order",
        component: PurchaseOrder,
        isFashNav: true
      },
      {
        title: "Receive Orders",
        icon: "icon-purchasing",
        route: "/stock/purchase-receive",
        component: ReceiveOrder,
        isFashNav: true
      },
      {
        title: "Re-Order Point",
        icon: "icon-undo",
        route: "/stock/re-order-point",
        component: ReOrderPoint,
        isFashNav: false
      },
      {
        title: "Stock Transfer",
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer,
        isFashNav: false
      },
      {
        title: "Stock Return",
        icon: "icon-sale-return",
        route: "/stock/return",
        component: StockReturn,
        isFashNav: true
      },
      {
        title: "Stock",
        icon: "icon-stock",
        route: "/stock",
        component: Stock,
        isFashNav: false
      },
      {
        title: "Stock Control",
        icon: "icon-barcode",
        route: "/stock/control",
        component: StockControl,
        isFashNav: false
      },
      {
        title: "Stock Audit",
        icon: "icon-stock-audit",
        route: "/stock/return",
        component: StockAudit,
        isFashNav: false
      }
    ]
  },
  customers: {
    icon: "icon-customer",
    route: "customers",
    subItems: [
      {
        title: "Manage Customer",
        icon: "icon-customer ",
        route: "/customers/manage",
        component: ManageCustomer,
        isFashNav: true
      },
      {
        title: "Group Customer",
        icon: "icon-employee",
        route: "/customers/group",
        component: GroupCustomer,
        isFashNav: true
      }
      // {
      //   title: "Purchase History",
      //   icon: "icon-time",
      //   route: "/customers/history",
      //   component: PurchaseHistory
      // }
    ]
  },
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
      
      // {
      //   title: "Timesheets",
      //   icon: "icon-timesheet",
      //   route: "/employees/timesheet",
      //   component: TimeSheet
      // },
      // {
      //   title: "Performance",
      //   icon: "icon-performance",
      //   route: "/employees/performance",
      //   component: Performance
      // }
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
        icon: "icon-taxes",
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
        icon: "icon-operation",
        route: "/settings/operation-record",
        component: OperationRecord,
        isFashNav: true
      }
    ]
  }
};

export default dataSource;