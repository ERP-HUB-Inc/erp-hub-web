/*==============================POS===================================*/
import React from "react";
import { Translate } from "react-localize-redux";
import Loadable from "react-loadable";
import StartUp from "../../StartUp";

// TRANSACTION
const Invoice = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Invoice"),
  loading: () => <StartUp />,
});

const RecurringInvoice = Loadable({
  loader: () => import("../../../../pos/components/transactions/RecurringInvoice"),
  loading: () => <StartUp />
});

const RecurringInvoiceForm = Loadable({
  loader: () => import("../../../../pos/components/transactions/RecurringInvoice/FormItem"),
  loading: () => <StartUp />
});

const RecurringInvoiceDetail = Loadable({
  loader: () => import("../../../../pos/components/transactions/RecurringInvoice/Detail"),
  loading: () => <StartUp />
});

const SaleOrderTransaction = Loadable({
  loader: () => import("../../../../pos/components/transactions/SaleOrder"),
  loading: () => <StartUp />,
});

const Return = Loadable({
  loader: () =>
    import("../../../../pos/containers/transactions/SaleHistory/Return"),
  loading: () => <StartUp />,
});

const Quotation = Loadable({
  loader: () => import("../../../../pos/containers/transactions/Quotation"),
  loading: () => <StartUp />,
});

const QuotationCreate = Loadable({
  loader: () =>
    import("../../../../pos/components/transactions/Quotation/FormItem"),
  loading: () => <StartUp />,
});

const QuotationUpdate = Loadable({
  loader: () =>
    import("../../../../pos/components/transactions/Quotation/FormItem"),
  loading: () => <StartUp />,
});

const QuotationDetail = Loadable({
  loader: () =>
    import("../../../../pos/components/transactions/Quotation/Detail"),
  loading: () => <StartUp />,
});

const OperationRecord = Loadable({
  loader: () => import("../../../../pos/containers/settings/OperationRecord"),
  loading: () => <StartUp />,
});

const SerialList = Loadable({
  loader: () => import("../../../../pos/components/transactions/Serial"),
  loading: () => <StartUp />
});

//Installment
const Installment = Loadable({
  loader: () => import("../../../../installment/components/installment"),
  loading: () => <StartUp />
});

const InstallmentDetail = Loadable({
  loader: () => import("../../../../installment/components/installment/Detail"),
  loading: () => <StartUp />
});

const InstallmentForm = Loadable({
  loader: () => import("../../../../installment/components/installment/FormItem"),
  loading: () => <StartUp />
});

const Repayment = Loadable({
  loader: () => import("../../../../installment/components/Repayment"),
  loading: () => <StartUp />
});

//Booking
const Booking = Loadable({
  loader: () => import("../../../../booking/components/booking"),
  loading: () => <StartUp />
});

// PRODUCT
const ManageProduct = Loadable({
  loader: () => import("../../../../inventory/containers/products/Product"),
  loading: () => <StartUp />,
});

const Promotion = Loadable({
  loader: () => import("../../../../inventory/components/products/Promotion"),
  loading: () => <StartUp />,
});

const LoyaltyProgram = Loadable({
  loader: () =>
    import("../../../../inventory/components/products/LoyaltyProgram"),
  loading: () => <StartUp />,
});

const LoyaltyProgramForm = Loadable({
  loader: () =>
    import("../../../../inventory/components/products/LoyaltyProgram/FormItem"),
  loading: () => <StartUp />,
});

const Attribute = Loadable({
  loader: () =>
    import("../../../../inventory/containers/products/VariantAttribute"),
  loading: () => <StartUp />,
});

const Brand = Loadable({
  loader: () => import("../../../../inventory/containers/products/Brand"),
  loading: () => <StartUp />,
});

const Category = Loadable({
  loader: () =>
    import("../../../../inventory/containers/products/ProductsType"),
  loading: () => <StartUp />,
});

const PrintPriceTag = Loadable({
  loader: () =>
    import("../../../../inventory/containers/products/PrintPriceTag"),
  loading: () => <StartUp />,
});

const ProductUnit = Loadable({
  loader: () =>
    import("../../../../inventory/containers/products/ProductsUnit"),
  loading: () => <StartUp />,
});

const PurchaseOrder = Loadable({
  loader: () => import("../../../../inventory/containers/stock/PurchaseOrder"),
  loading: () => <StartUp />,
});

const StockConsignment = Loadable({
  loader: () =>
    import("../../../../inventory/containers/stock/StockConsignment"),
  loading: () => <StartUp />,
});

const StockConsignmentForm = Loadable({
  loader: () =>
    import("../../../../inventory/components/stock/StockConsignment/FormItem"),
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
  loader: () =>
    import("../../../../inventory/containers/stock/StockAdjustmentRequest"),
  loading: () => <StartUp />,
});

// REPORT
const SaleReportDashboard = Loadable({
  loader: () =>
    import("../../../../pos/containers/reports/Sale/SaleReportDashboard"),
  loading: () => <StartUp />,
});

const LowSaleReport = Loadable({
  loader: () =>
    import("../../../../pos/components/reports/Sale/ReportLowSales"),
    loading: () => <StartUp />,
});

const PurchaseReportDashboard = Loadable({
  loader: () =>
    import(
      "../../../../pos/components/reports/Purchase/PurchaseReportDashboard"
    ),
  loading: () => <StartUp />,
});

const StockReport = Loadable({
  loader: () => import("../../../../pos/components/reports/Stock"),
  loading: () => <StartUp />
});

const ProductReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Product"),
  loading: () => <StartUp />,
});

const InventoryDashboard = Loadable({
  loader: () => import("../../../../pos/components/reports/Inventory/InventoryDashboard"),
  loading: () => <StartUp />,
});

const AdjustmentReport = Loadable({
  loader: () => import("../../../../pos/containers/reports/Adjustment"),
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

const WebsiteSetting = Loadable({
  loader: () => import("../../../../pos/containers/settings/WebsiteSetting"),
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

const RoleCreate = Loadable({
  loader: () => import("../../../../pos/containers/settings/RoleAccess/FormCreate"),
  loading: () => <StartUp />
});

const RoleUpdate = Loadable({
  loader: () => import("../../../../pos/containers/settings/RoleAccess/FormUpdate"),
  loading: () => <StartUp />
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

const CustomerProfile = Loadable({
  loader: () => import("../../../../crm/components/customers/Customer/Profile"),
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
        isFashNav: false,
      },
      {
        title: <Translate id="text_quotation" />,
        icon: "icon-pre-order",
        route: "/transactions/quotation",
        component: Quotation,
        isFashNav: true,
      },
      {
        route: "/transactions/quotation-create",
        component: QuotationCreate,
        isFashNav: false,
      },
      {
        route: "/transactions/quotation-update/:id",
        component: QuotationUpdate,
        isFashNav: false,
      },
      {
        route: "/transactions/quotation-detail/:id",
        component: QuotationDetail,
        isFashNav: false,
      },
      {
        title: <Translate id="text_sale_order" />,
        icon: "icon-time",
        route: "/transactions/sales-order",
        component: SaleOrderTransaction,
        isFashNav: true,
      },
      {
        title: <Translate id="text_invoices" />,
        icon: "icon-calendar",
        route: "/transactions/invoice",
        component: Invoice,
        isFashNav: true,
      },
      {
        title: <Translate id="text_recurring_invoice" />,
        icon: "icon-undo",
        route: "/transactions/recurring-invoice/list",
        component: RecurringInvoice,
        isSeparate: true,
        isFashNav: true
      },
      {
        route: "/transactions/recurring-invoice/create",
        component: RecurringInvoiceForm,
        isFashNav: false
      },
      {
        route: "/transactions/recurring-invoice/detail/:id",
        component: RecurringInvoiceDetail,
        isFashNav: false
      },
      {
        route: "/transactions/recurring-invoice/update/:id",
        component: RecurringInvoiceForm,
        isFashNav: false
      },
      {
        title: <Translate id="text_serial_no" />,
        icon: "icon-barcode",
        route: "/transaction/serials",
        component: SerialList,
        isFashNav: true
      },
      {
        title: <Translate id="text_income_and_expense" />,
        icon: "icon-operation",
        route: "/transactions/income_expense",
        component: OperationRecord,
        isFashNav: true,
      },
    ],
  },
  installment: {
    icon: "icon-calendar",
    route: "installment",
    title: <Translate id="text_installment" />,
    subItems: [
      {
        title: <Translate id="text_installment" />,
        icon: "icon-calendar",
        route: "/installment/list",
        component: Installment,
        isFashNav: true,
      },
      {
        route: "/installment/detail/:id",
        component: InstallmentDetail,
        isFashNav: false
      },
      {
        route: "/installment/create",
        component: InstallmentForm,
        isFashNav: false,
      },
      {
        route: "/installment/update/:id",
        component: InstallmentForm,
        isFashNav: false
      },
      {
        title: <Translate id="text_repayment" />,
        icon: "icon-dollar",
        route: "/installment/repayments",
        component: Repayment,
        isFashNav: true
      }
    ]
  },
  bookings: {
    icon: "icon-time",
    route: "bookings",
    title: <Translate id="text_booking" />,
    subItems: [
      {
        title: <Translate id="text_booking" />,
        icon: "icon-time",
        route: "/bookings/list",
        component: Booking,
        isFashNav: true
      }
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
        isFashNav: true,
      },
      {
        route: "/loyalty-program/create",
        component: LoyaltyProgramForm,
        isFashNav: false,
      },
      {
        route: "/loyalty-program/update/:id",
        component: LoyaltyProgramForm,
        isFashNav: false,
      },
      {
        title: <Translate id="text_category" />,
        icon: "icon-types",
        route: "/products/category",
        component: Category,
        isFashNav: true,
      },
      {
        title: <Translate id="text_attribute" />,
        icon: "icon-time",
        route: "/products/attributes",
        component: Attribute,
      },
      {
        title: <Translate id="text_brand" />,
        icon: "icon-brand",
        route: "/products/brand",
        component: Brand,
      },
      {
        title: <Translate id="text_manage_unit" />,
        icon: "icon-price-book",
        route: "/products/units",
        component: ProductUnit,
        isSeparate: true,
        isFashNav: true,
      },
      {
        title: <Translate id="text_promotion" />,
        icon: "icon-sale-return",
        route: "/promotions/list",
        component: Promotion,
        isFashNav: true,
      },
      {
        title: <Translate id="text_loyalty_program" />,
        icon: "icon-sale-return",
        route: "/loyalty-program/list",
        component: LoyaltyProgram,
        isSeparate: true,
        isFashNav: true,
      },
      {
        title: <Translate id="text_print_price_tags" />,
        icon: "icon-price-book",
        route: "/products/price-tags",
        component: PrintPriceTag,
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
    ],
  },
  stocks: {
    icon: "icon-stock",
    route: "stock",
    title: <Translate id="text_stock" />,
    subItems: [
      {
        title: <Translate id="text_supplier" />,
        icon: "icon-customer",
        route: "/stock/supplier",
        component: Supplier,
        isSeparate: true,
        isFashNav: true,
      },
      {
        title: <Translate id="text_purchase_order" />,
        icon: "icon-purchasing",
        route: "/stock/purchase/order",
        component: PurchaseOrder,
        isFashNav: true,
      },
      {
        title: <Translate id="text_stock_consignment" />,
        icon: "icon-purchasing",
        route: "/stock/consignment/list",
        component: StockConsignment,
        isSeparate: true,
        isFashNav: true,
      },
      {
        route: "/stock/consignment/create",
        component: StockConsignmentForm,
        isFashNav: false,
      },
      {
        route: "/stock/consignment/update/:id",
        component: StockConsignmentForm,
        isFashNav: false,
      },
      {
        title: <Translate id="text_stock_adjustment" />,
        icon: "icon-stock-audit",
        route: "/stock/adjustment/request",
        component: StockAdjustmentRequest,
        isFashNav: true,
      },
      {
        title: <Translate id="text_stock_transfer" />,
        icon: "icon-stock-transfer",
        route: "/stock/transfer",
        component: StockTransfer,
        isFashNav: true,
      },
    ],
  },
  customers: {
    icon: "icon-customer",
    route: "customers",
    title: <Translate id="text_manage_customer" />,
    subItems: [
      {
        title: <Translate id="text_customer" />,
        icon: "icon-customer ",
        route: "/customer",
        component: ManageCustomer,
        isFashNav: true,
      },
      {
        title: <Translate id="text_group" />,
        icon: "icon-employee",
        route: "/customers/group",
        component: GroupCustomer,
        isFashNav: true,
      },
      {
        route: "/customer-profile/:id",
        component: CustomerProfile,
        isFashNav: false,
      },
    ],
  },
  employees: {
    icon: "icon-employee",
    route: "employees",
    title: <Translate id="text_manage_employee" />,
    subItems: [
      {
        title: <Translate id="text_employee" />,
        icon: "icon-employee",
        route: "/employee",
        component: ManageEmployee,
      },
      {
        route: "/profile",
        component: Profile,
      },
    ],
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
        component: SaleReportDashboard,
      },
      {
        title: <Translate id="text_low_sales_report" />,
        icon: "icon-stock",
        route: "/reports/low_sales",
        component: LowSaleReport,
      },
      {
        title: <Translate id="text_register_report" />,
        icon: "icon-currency",
        route: "/reports/register",
        component: RegisterReport,
        isSeparate: true,
        isFashNav: true
      },
      {
        title: <Translate id="text_purchase_report" />,
        icon: "icon-purchasing",
        route: "/reports/purchase_dashboard",
        component: PurchaseReportDashboard,
      },
      {
        title: <Translate id="text_stock_report" />,
        icon: "icon-stock",
        route: "/reports/stock",
        component: StockReport
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
        isSeparate: true,
        isFashNav: true,
      },
      {
        route: "/reports/adjustment-report",
        component: AdjustmentReport,
        isFashNav: false,
      },
      {
        title: <Translate id="text_profit_and_loss_report" />,
        icon: "icon-sale-return",
        route: "/reports/profit-lost",
        component: ProfitAndLostReport,
        isFashNav: true,
      },
    ],
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
        isFashNav: true,
      },
      {
        title: <Translate id="text_website_setting" />,
        icon: "icon-account",
        route: "/settings/website-setting",
        component: WebsiteSetting,
        isFashNav: true,
      },
      {
        title: <Translate id="text_location" />,
        icon: "icon-store",
        route: "/settings/location",
        component: StoreLocation,
        isFashNav: true,
      },
      {
        title: <Translate id="text_receipt_template" />,
        icon: "icon-receipt",
        route: "/settings/receipt/template",
        component: ReceiptTemplate,
        isFashNav: true,
      },
      {
        title: <Translate id="text_payment_method" />,
        icon: "icon-payment-method",
        route: "/settings/payment-method",
        component: PaymentMethod,
        isFashNav: false,
      },
      {
        title: <Translate id="text_tax" />,
        icon: "icon-taxes",
        route: "/settings/tax",
        component: Tax,
        isFashNav: true,
      },
      {
        title: <Translate id="text_role_access" />,
        icon: "icon-role",
        route: "/settings/role",
        component: RoleAccess,
        isFashNav: true,
      },
      {
        route: "/settings/role-create",
        component: RoleCreate,
        isFashNav: false
      },
      {
        route: "/settings/role-update/:id",
        component: RoleUpdate,
        isFashNav: false
      },
      {
        title: <Translate id="text_currency" />,
        icon: "icon-currency",
        route: "/settings/currency",
        component: Currency,
        isFashNav: false,
      },
      {
        title: <Translate id="currency_exchange" />,
        icon: "icon-operation",
        route: "/settings/currency-exchange",
        component: CurrencyExchange,
        isFashNav: true,
      },
      {
        title: <Translate id="text_language" />,
        icon: "icon-language",
        route: "/settings/language",
        component: StoreLanguage,
        isFashNav: false,
      },
    ],
  },
};

export default dataSource;
