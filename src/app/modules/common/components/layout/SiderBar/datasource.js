/*==============================POS===================================*/
import React from "react";
import { Translate } from "react-localize-redux";
import Loadable from "react-loadable";
import StartUp from "../../StartUp";

// TRANSACTION
const SaleHistory = Loadable({
  loader: () => import("../../../../pos/containers/transactions/SaleHistory"),
  loading: () => <StartUp />,
});
const SaleOrder = Loadable({
  loader: () => import("../../../../pos/containers/transactions/SaleWalkin"),
  loading: () => <StartUp />,
});
const OpenSaleRegistration = Loadable({
  loader: () => import("../../../../pos/containers/transactions/OpenSaleRegistration"),
  loading: () => <StartUp />,
});

// PRODUCT
const ManageProduct = Loadable({
  loader: () => import("../../../../inventory/containers/products/Product"),
  loading: () => <StartUp />,
});

const Brand = Loadable({
  loader: () => import("../../../../inventory/containers/products/Brand"),
  loading: () => <StartUp />,
});

const ProductType = Loadable({
  loader: () => import("../../../../inventory/containers/products/ProductsType"),
  loading: () => <StartUp />,
});

const ProductTag = Loadable({
  loader: () => import("../../../../inventory/containers/products/ProductsTag"),
  loading: () => <StartUp />,
});

const PrintPriceTag = Loadable({
  loader: () => import("../../../../inventory/containers/products/PrintPriceTag"),
  loading: () => <StartUp />,
});

const ProductUnit = Loadable({
  loader: () => import("../../../../inventory/containers/products/ProductsUnit"),
  loading: () => <StartUp />,
});

// STOCK CONTROL
// const Stock = Loadable({
//   loader: () => import("../../../../inventory/containers/stock/StockManagement"),
//   loading: () => <StartUp />,
// });

const PurchaseOrder = Loadable({
  loader: () => import("../../../../inventory/containers/stock/PurchaseOrder"),
  loading: () => <StartUp />,
});

const ReceiveOrder = Loadable({
  loader: () => import("../../../../inventory/containers/stock/ReceivePurchase"),
  loading: () => <StartUp />,
});

const StockReturn = Loadable({
  loader: () => import("../../../../inventory/containers/stock/ReturnPurchase"),
  loading: () => <StartUp />,
});

const StockTransfer = Loadable({
  loader: () => import("../../../../inventory/containers/stock/StockTransfer"),
  loading: () => <StartUp />,
});

const ReceiveStockTransfer = Loadable({
  loader: () => import("../../../../inventory/containers/stock/ReceiveStockTransfer"),
  loading: () => <StartUp />,
});

const Supplier = Loadable({
  loader: () => import("../../../../inventory/containers/stock/Supplier"),
  loading: () => <StartUp />,
});

const StockAdjustmentRequest = Loadable({
  loader: () => import("../../../../inventory/containers/stock/StockAdjustmentRequest"),
  loading: () => <StartUp />,
});

const StockAdjustmentApprove = Loadable({
  loader: () => import("../../../../inventory/containers/stock/StockAdjustmentApprove"),
  loading: () => <StartUp />,
});

// REPORT
const SaleReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Sale"),
  loading: () => <StartUp />,
});

const PurchaseReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Purchase"),
  loading: () => <StartUp />,
});

const ProductReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Product"),
  loading: () => <StartUp />,
});

// const InventoryReport = Loadable({
//   loader: () => import("../../../../pos/containers/reports/Inventory"),
//   loading: () => <StartUp />,
// });

// const PaymentReport = Loadable({
//   loader: () => import("../../../../pos/containers/reports/Payment"),
//   loading: () => <StartUp />,
// });

const ProfitAndLostReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/ProfitAndLost"),
  loading: () => <StartUp />,
});

// const TaxReport = Loadable({
//   loader: () => import("../../../../pos/containers/reports/Tax"),
//   loading: () => <StartUp />,
// });

// SETTING
const StoreAccount = Loadable({
  loader: () => import("../../../../pos/containers/settings/StoreAccount"),
  loading: () => <StartUp />,
});

const StoreLocation = Loadable({
  loader: () => import("../../../../pos/containers/settings/StoreLocation"),
  loading: () => <StartUp />,
});

const Tax = Loadable({
  loader: () => import("../../../../pos/containers/settings/Tax"),
  loading: () => <StartUp />,
});

const ReceiptTemplate = Loadable({
  loader: () => import("../../../../pos/containers/settings/ReceiptTemplate"),
  loading: () => <StartUp />,
});

const PaymentMethod = Loadable({
  loader: () => import("../../../../pos/containers/settings/PaymentMethod"),
  loading: () => <StartUp />,
});

const RoleAccess = Loadable({
  loader: () => import("../../../../pos/containers/settings/RoleAccess"),
  loading: () => <StartUp />,
});

const Currency = Loadable({
  loader: () => import("../../../../pos/containers/settings/Currency"),
  loading: () => <StartUp />,
});

const CurrencyExchange = Loadable({
  loader: () => import("../../../../pos/containers/settings/CurrencyExchange"),
  loading: () => <StartUp />,
});

const StoreLanguage = Loadable({
  loader: () => import("../../../../pos/containers/settings/StoreLanguage"),
  loading: () => <StartUp />,
});

const OperationRecord = Loadable({
  loader: () => import("../../../../pos/containers/settings/OperationRecord"),
  loading: () => <StartUp />,
});

/*==============================END POS===================================*/

/*==============================HR===================================*/

// EMPLOYEE
const ManageEmployee = Loadable({
  loader: () => import("../../../../hr/containers/employees/Employee"),
  loading: () => <StartUp />,
});

/*==============================END HR===================================*/

/*==============================CRM===================================*/

// CUSTOMER
const GroupCustomer = Loadable({
  loader: () => import("../../../../crm/containers/customers/Group"),
  loading: () => <StartUp />,
});
const ManageCustomer = Loadable({
  loader: () => import("../../../../crm/containers/customers/Customer"),
  loading: () => <StartUp />,
});

const Profile = Loadable({
  loader: () => import("../../../containers/user/Profile"),
  loading: () => <StartUp />,
});

/*==============================END CRM===================================*/


/*==============================COMMON===================================*/
// SETTING

/*==============================END COMMON===================================*/

const dataSource = {
  transactions: {
    icon: "icon-list",
    route: "transactions",
    subItems: [
      {
        title: <Translate id="text_sale_history" />,
        icon: "icon-time",
        route: "/transactions/salehistory", 
        component: SaleHistory,
        isFashNav: true
      },
      {
        title: <Translate id="text_sale_order" />,
        icon: "icon-pre-order",
        route: "/transactions/saleorder",
        component: SaleOrder,
        isFashNav: true
      },
      {
        title: "Close Shift",
        icon: "icon-currency",
        route: "/transactions/saleregister",
        component: OpenSaleRegistration,
        isFashNav: true
      },
      // {
      //   title: <Translate id="text_return_exchange" />,
      //   icon: "icon-sale-return",
      //   route: "/transactions/return/exchange",
      //   component: ReturnExchange,
      //   isFashNav: true
      // }
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
      // {
      //   title: "Price Books",
      //   icon: "icon-price-book",
      //   route: "/products/price-books",
      //   component: PriceBook,
      //   isFashNav: true
      // },
      // {
      //   title: "Promotions",
      //   icon: "icon-promotion",
      //   route: "/products/promotion",
      //   component: Promotion,
      //   isFashNav: true
      // }
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
        title: "Receive Purchase",
        icon: "icon-purchasing",
        route: "/stock/purchase/receive",
        component: ReceiveOrder,
        isFashNav: false
      },
      {
        title: "Return Purchase",
        icon: "icon-sale-return",
        route: "/stock/return",
        component: StockReturn,
        isFashNav: false
      },
      {
        //   title: "Re-Order Point",
        //   icon: "icon-undo",
        //   route: "/stock/re-order-point",
        //   component: ReOrderPoint,
        //   isFashNav: false
        // },
        // {
        title: "Stock Transfer",
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer,
        isFashNav: true
      },
      {
        title: "Adjustment Request",
        icon: "icon-stock-transfer",
        route: "/stock/adjustment/request",
        component: StockAdjustmentRequest,
        isFashNav: true
      },
      {
        title: "Adjustment Approve",
        icon: "icon-stock-transfer",
        route: "/stock/adjustment/approve",
        component: StockAdjustmentApprove,
        isFashNav: true
      },
      {
        title: "Receive Transfer",
        icon: "icon-stock-transfer",
        route: "/stock/receive/transfer",
        component: ReceiveStockTransfer,
        isFashNav: false
      }
     
      // {
      //   title: "Stock",
      //   icon: "icon-stock",
      //   route: "/stock",
      //   component: Stock,
      //   isFashNav: false
      // },
      // {
      //   title: "Stock Control",
      //   icon: "icon-barcode",
      //   route: "/stock/control",
      //   component: StockControl,
      //   isFashNav: false
      // },
      // {
      //   title: "Stock Audit",
      //   icon: "icon-stock-audit",
      //   route: "/stock/return",
      //   component: StockAudit,
      //   isFashNav: false
      // }
    ]
  },
  customers: {
    icon: "icon-customer",
    route: "customers",
    subItems: [
      {
        title: "Manage Customer",
        icon: "icon-customer ",
        route: "/customer",
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
        route: "/employee",
        component: ManageEmployee
      },
      {
        route: "/profile",
        component: Profile
      }
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
        component: SaleReport,
        isFashNav: true
      },
      {
        title: "Purchase Report",
        icon: "icon-purchasing",
        route: "/reports/purchase",
        component: PurchaseReport,
        isFashNav: true
      },
      {
        title: "Products Report",
        icon: "icon-items",
        route: "/reports/product",
        component: ProductReport,
        isFashNav: true
      },
      // {
      //   title: "Inventory Report",
      //   icon: "icon-stock",
      //   route: "/reports/inventory",
      //   component: InventoryReport,
      //   isFashNav: false
      // },
      // {
      //   title: "Payment Report",
      //   icon: "icon-payment-report",
      //   route: "/reports/payment",
      //   component: PaymentReport,
      //   isFashNav: false
      // },
      {
        title: "Profit & Lost Report",
        icon: "icon-sale-return",
        route: "/reports/profit-lost",
        component: ProfitAndLostReport,
        isFashNav: true
      },
      // {
      //   title: "Tax Report",
      //   icon: "icon-tax-report",
      //   route: "/reports/tax",
      //   component: TaxReport,
      //   isFashNav: false
      // }
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
        title: "Location",
        icon: "icon-store",
        route: "/settings/location",
        component: StoreLocation,
        isFashNav: true
      },
      {
        title: "Receipt Template",
        icon: "icon-receipt",
        route: "/settings/receipt/template",
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
        title: "Currency Exchange",
        icon: "icon-currency",
        route: "/settings/currency-exchange",
        component: CurrencyExchange,
        isFashNav: true
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