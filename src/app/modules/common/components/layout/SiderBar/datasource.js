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

const Invoice = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Invoice"),
  loading: () => <StartUp />
});

const SaleOrderTransaction = Loadable({
  loader: () => import("../../../../pos/components/transactions/SaleOrder"),
  loading: () => <StartUp />
});

const Return = Loadable({
  loader: () => import("../../../../pos/containers/transactions/SaleHistory/Return"),
  loading: () => <StartUp />,
});

const Quotation = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Quotation"),
  loading: () => <StartUp />,
});

const QuotationCreate = Loadable({
  loader: () => import("../../../../pos/components/transactions/Quotation/FormItem"),
  loading: () => <StartUp />,
});

const QuotationUpdate = Loadable({
  loader: () => import("../../../../pos/components/transactions/Quotation/FormItem"),
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

const Promotion = Loadable({
  loader: () => import("../../../../inventory/components/products/Promotion"),
  loading: () => <StartUp />
});

const Attribute = Loadable({
  loader: () => import("../../../../inventory/containers/products/VariantAttribute"),
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

const PrintPriceTag = Loadable({
  loader: () => import("../../../../inventory/containers/products/PrintPriceTag"),
  loading: () => <StartUp />,
});

const ProductUnit = Loadable({
  loader: () => import("../../../../inventory/containers/products/ProductsUnit"),
  loading: () => <StartUp />,
});

const PurchaseOrder = Loadable({
  loader: () => import("../../../../inventory/containers/stock/PurchaseOrder"),
  loading: () => <StartUp />,
});

const StockTransfer = Loadable({
  loader: () => import("../../../../inventory/containers/stock/StockTransfer"),
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

// REPORT
const SaleReportDashboard = Loadable({
  loader: () => import("../../../../pos/containers/reports/Sale/SaleReportDashboard"),
  loading: () => <StartUp />,
});

const LowSaleReport = Loadable({
  loader: () => import("../../../../pos/components/reports/Sale/ReportLowSales"),
  loading: () => <StartUp />,
});

const PurchaseReportDashboard = Loadable({
  loader: () => import("../../../../pos/components/reports/Purchase/PurchaseReportDashboard"),
  loading: () => <StartUp />,
});

const ProductReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Product"),
  loading: () => <StartUp />,
});

const InventoryDashboard = Loadable({
  loader: () => import("../../../../pos/containers/reports/Inventory/InventoryDashboard"),
  loading: () => <StartUp />,
});

const RegisterReport = Loadable({
  loader: () => import("../../../../pos/components/reports/Register"),
  loading: () => <StartUp />,
});

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
        route: "/transactions/return", 
        component: Return,
        isFashNav: false
      },
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
        route: "/transactions/quotation-update/:id", 
        component: QuotationUpdate,
        isFashNav: false
      },
      {
        title: <Translate id="text_sale_order" />,
        icon: "icon-time",
        route: "/transactions/sales-order",
        component: SaleOrderTransaction,
        isFashNav: true
      },
      {
        title: <Translate id="text_invoices" />,
        icon: "icon-calendar",
        route: "/transactions/invoice",
        component: Invoice,
        isFashNav: true
      },
      {
        title: <Translate id="text_close_shift" />,
        icon: "icon-currency",
        route: "/transactions/saleregister",
        component: OpenSaleRegistration,
        isFashNav: true
      }
     
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
    title: <Translate id="text_manage_product" />,
    subItems: [
      {
        title: <Translate id="text_product" />,
        icon: "icon-time",
        route: "/products/list",
        component: ManageProduct,
        isFashNav: true
      },
      {
        title: <Translate id="text_promotion" />,
        icon: "icon-sale-return",
        route: "/promotions/list",
        component: Promotion,
        isFashNav: true
      },
      {
        title: <Translate id="text_category" />,
        icon: "icon-types",
        route: "/products/category",
        component: Category,
        isFashNav: true
      },
      {
        title: <Translate id="text_attribute" />,
        icon: "icon-time",
        route: "/products/attributes",
        component: Attribute
      },
      {
        title:  <Translate id="text_brand" />,
        icon: "icon-brand",
        route: "/products/brand",
        component: Brand
      },
      {
        title: <Translate id="text_manage_unit" />,
        icon: "icon-price-book",
        route: "/products/units",
        component: ProductUnit,
        isFashNav: true
      },
      {
        title: <Translate id="text_print_price_tags" />,
        icon: "icon-price-book",
        route: "/products/price-tags",
        component: PrintPriceTag
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
      // {
      //   title: <Translate id="text_sale_order" />,
      //   icon: "icon-time",
      //   route: "/stock/sale-order",
      //   component: SaleOrderQuotation,
      //   isFashNav: true
      // },
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
      // {
      //   title: <Translate id="text_receive_purchase" />,
      //   icon: "icon-import",
      //   route: "/stock/purchase/receive",
      //   component: ReceiveOrder,
      //   isFashNav: false
      // },
      // {
      //   title: <Translate id="text_return_purchase" />,
      //   icon: "icon-sale-return",
      //   route: "/stock/return",
      //   component: StockReturn,
      //   isFashNav: false
      // },
      {
        title: <Translate id="text_stock_adjustment" />,
        icon: "icon-stock-audit",
        route: "/stock/adjustment/request",
        component: StockAdjustmentRequest,
        isFashNav: true
      },
      {
        title: <Translate id="text_stock_transfer" />,
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer,
        isFashNav: true
      },
      // {
      //   title: <Translate id="text_receive_transfer" />,
      //   icon: "icon-import",
      //   route: "/stock/receive/transfer",
      //   component: ReceiveStockTransfer,
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
        route: "/reports/sale_dashboard",
        component: SaleReportDashboard
      },
      {
        title: <Translate id="text_low_sales_report" />,
        icon: "icon-stock",
        route: "/reports/low_sales",
        new: "New",
        component: LowSaleReport
      },
      {
        title: <Translate id="text_register_report" />,
        icon: "icon-currency",
        route: "/reports/register",
        isFashNav: true,
        component: RegisterReport
      },
      {
        title: <Translate id="text_purchase_report" />,
        icon: "icon-purchasing",
        route: "/reports/purchase_dashboard",
        component: PurchaseReportDashboard
      },
      {
        title: <Translate id="text_product_report" />,
        icon: "icon-items",
        route: "/reports/product",
        component: ProductReport,
      },
      {
        title: <Translate id="text_inventory_dashboard" />,
        icon: "icon-stock",
        route: "/reports/inventory_dashboard",
        component: InventoryDashboard,
        isFashNav: true
      },
      {
        title: <Translate id="text_profit_and_loss_report" />,
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