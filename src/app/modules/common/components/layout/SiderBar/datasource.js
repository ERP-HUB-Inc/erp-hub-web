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

const Quotation = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Quotation"),
  loading: () => <StartUp />,
});

const QuotationCreate = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Quotation/FormCreate"),
  loading: () => <StartUp />,
});

const QuotationUpdate = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Quotation/FormUpdate"),
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

const Category = Loadable({
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

// const importProduct = Loadable({
//   loader: () => import("../../../../inventory/containers/products/ProductsUnit/importProduct"),
//   loading: () => <StartUp />,
// });

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

const SaleOrderQuotation = Loadable({
  loader: () => import("../../../../inventory/containers/stock/SaleOrder"),
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
    title: <Translate id="text_transaction" />,
    subItems: [
      {
        title: <Translate id="text_quotation" />,
        icon: "icon-pre-order",
        route: "/transactions/quotation", 
        component: Quotation,
        isFashNav: true
      },
      {
        route: "/transactions/quotation-create", 
        component: QuotationCreate,
        isFashNav: false
      },
      {
        route: "/transactions/quotation-update", 
        component: QuotationUpdate,
        isFashNav: false
      },
      {
        title: <Translate id="text_sale_history" />,
        icon: "icon-time",
        route: "/transactions/salehistory", 
        component: SaleHistory,
        isFashNav: true
      },
      {
        title: <Translate id="text_sale_order_pos" />,
        icon: "icon-sale",
        route: "/transactions/saleorder",
        component: SaleOrder,
        isFashNav: true
      },
      {
        title: <Translate id="text_close_shift" />,
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
    title: <Translate id="text_product" />,
    subItems: [
      {
        title: <Translate id="text_manage_product" />,
        icon: "icon-time",
        route: "/products/manage",
        component: ManageProduct,
        isFashNav: true
      },
      {
        title:  <Translate id="text_brand" />,
        icon: "icon-brand",
        route: "/products/brand",
        component: Brand,
        isFashNav: true
      },
      {
        title: <Translate id="text_product_type" />,
        icon: "icon-types",
        route: "/products/category",
        component: Category,
        isFashNav: true
      },
      {
        title: <Translate id="text_product_tags" />,
        icon: "icon-tags",
        route: "/products/tags",
        component: ProductTag,
        isFashNav: true
      },
      {
        title: <Translate id="text_print_price_tags" />,
        icon: "icon-price-book",
        route: "/products/price-tags",
        component: PrintPriceTag,
        isFashNav: true
      },
      {
        title: <Translate id="text_manage_unit" />,
        icon: "icon-price-book",
        route: "/products/units",
        component: ProductUnit,
        isFashNav: true
      },
      // {
      //   title: "Import Product",
      //   icon: "icon-price-book",
      //   route: "/products/import",
      //   component: importProduct,
      //   isFashNav: false
      // }
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
    title: <Translate id="text_stock" />,
    subItems: [
      {
        title: <Translate id="text_sale_order" />,
        icon: "icon-time",
        route: "/stock/sale-order",
        component: SaleOrderQuotation,
        isFashNav: true
      },
      {
        title: <Translate id="text_supplier" />,
        icon: "icon-customer",
        route: "/stock/supplier",
        component: Supplier,
        isFashNav: true
      },
      {
        title: <Translate id="text_purchase_order" />,
        icon: "icon-purchasing",
        route: "/stock/purchase/order",
        component: PurchaseOrder,
        isFashNav: true
      },
      {
        title: <Translate id="text_receive_purchase" />,
        icon: "icon-import",
        route: "/stock/purchase/receive",
        component: ReceiveOrder,
        isFashNav: false
      },
      {
        title: <Translate id="text_return_purchase" />,
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
        title: <Translate id="text_stock_transfer" />,
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer,
        isFashNav: true
      },
      {
        title: <Translate id="text_receive_transfer" />,
        icon: "icon-import",
        route: "/stock/receive/transfer",
        component: ReceiveStockTransfer,
        isFashNav: false
      },
      {
        title: <Translate id="text_adjustment_request" />,
        icon: "icon-stock-audit",
        route: "/stock/adjustment/request",
        component: StockAdjustmentRequest,
        isFashNav: true
      },
      {
        title: <Translate id="text_adjustment_approve" />,
        icon: "icon-import",
        route: "/stock/adjustment/approve",
        component: StockAdjustmentApprove,
        isFashNav: true
      },
      
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
    title: <Translate id="text_customer" />,
    subItems: [
      {
        title: <Translate id="text_manage_customer" />,
        icon: "icon-customer ",
        route: "/customer",
        component: ManageCustomer,
        isFashNav: true
      },
      {
        title: <Translate id="text_group_customer" />,
        icon: "icon-employee",
        route: "/customers/group",
        component: GroupCustomer,
        isFashNav: true
      }
    ]
  },
  employees: {
    icon: "icon-employee",
    route: "employees",
    title: <Translate id="text_employee" />,
    subItems: [
      {
        title: <Translate id="text_manage_employee" />,
        icon: "icon-employee",
        route: "/employee",
        component: ManageEmployee
      },
      {
        route: "/profile",
        component: Profile
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
    title: <Translate id="text_report" />,
    subItems: [
      {
        title: <Translate id="text_sale_report" />,
        icon: "icon-sale-report",
        route: "/reports/sale",
        component: SaleReport,
        isFashNav: true
      },
      {
        title: <Translate id="text_purchase_report" />,
        icon: "icon-purchasing",
        route: "/reports/purchase",
        component: PurchaseReport,
        isFashNav: true
      },
      {
        title: <Translate id="text_product_report" />,
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
        title: <Translate id="text_profit_and_lost_report" />,
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
    title: <Translate id="text_setting" />,
    subItems: [
      {
        title: <Translate id="text_store_account" />,
        icon: "icon-account",
        route: "/settings/account",
        component: StoreAccount,
        isFashNav: true
      },
      {
        title: <Translate id="text_location" />,
        icon: "icon-store",
        route: "/settings/location",
        component: StoreLocation,
        isFashNav: true
      },
      {
        title: <Translate id="text_receipt_template" />,
        icon: "icon-receipt",
        route: "/settings/receipt/template",
        component: ReceiptTemplate,
        isFashNav: true
      },
      {
        title: <Translate id="text_payment_method" />,
        icon: "icon-payment-method",
        route: "/settings/payment-method",
        component: PaymentMethod,
        isFashNav: false
      },
      {
        title: <Translate id="text_tax" />,
        icon: "icon-taxes",
        route: "/settings/tax",
        component: Tax,
        isFashNav: true
      },
      {
        title: <Translate id="text_role_access" />,
        icon: "icon-role",
        route: "/settings/role",
        component: RoleAccess,
        isFashNav: true
      },
      {
        title: <Translate id="text_currency" />,
        icon: "icon-currency",
        route: "/settings/currency",
        component: Currency,
        isFashNav: false
      },
      {
        title: <Translate id="currency_exchange" />,
        icon: "icon-operation",
        route: "/settings/currency-exchange",
        component: CurrencyExchange,
        isFashNav: true
      },
      {
        title: <Translate id="text_language" />,
        icon: "icon-language",
        route: "/settings/language",
        component: StoreLanguage,
        isFashNav: false
      },
      {
        title: <Translate id="operation_record_title" />,
        icon: "icon-operation",
        route: "/settings/operation-record",
        component: OperationRecord,
        isFashNav: true
      }
    ]
  }
};

export default dataSource;