import SaleHistory from "../../../containers/transactions/SaleHistory";
import SaleOrder from "../../../containers/transactions/SaleOrder";

const dataSource = {
  transactions: [
    {
      title: "Sale History",
      icon: "icon-time",
      route: "/transactions/sale-history",
      component: SaleHistory
    },
    {
      title: "Sale Order",
      icon: "icon-pre-order",
      route: "/transactions/sale-order",
      component: SaleOrder
    },
    {
      title: "Return Exchange",
      icon: "icon-sale-return",
      route: "/transactions/return-exchange",
      component: SaleHistory
    }
  ],
  products: [
    {
      title: "Manage Products",
      icon: "icon-time",
      route: "/products/return-exchange",
      component: SaleHistory
    },
    {
      title: "Brands",
      icon: "icon-brand",
      route: "/products/brand",
      component: SaleHistory
    },
    {
      title: "Product Types",
      icon: "icon-types",
      route: "/products/types",
      component: SaleHistory
    },
    {
      title: "Product Tags",
      icon: "icon-tags",
      route: "/products/tags",
      component: SaleHistory
    },
    {
      title: "Print Price Tags",
      icon: "icon-price-book",
      route: "/products/price-tags",
      component: SaleHistory
    },
    {
      title: "Manage Units",
      icon: "icon-price-book",
      route: "/products/units",
      component: SaleHistory
    },
    {
      title: "Price Books",
      icon: "icon-price-book",
      route: "/products/price-books",
      component: SaleHistory
    },
    {
      title: "Promotions",
      icon: "icon-promotion",
      route: "/products/promotion",
      component: SaleHistory
    }
  ],
  stock: [
    {
      title: "Stock",
      icon: "icon-time",
      route: "/stock",
      component: SaleHistory
    },
    {
      title: "Stock Control",
      icon: "icon-pre-order",
      route: "/stock/control",
      component: SaleHistory
    },
    {
      title: "Re-Order Point",
      icon: "icon-sale-return",
      route: "/stock/re-order-point",
      component: SaleHistory
    },
    {
      title: "Purchase Orders",
      icon: "icon-sale-return",
      route: "/stock/purchase-order",
      component: SaleHistory
    },
    {
      title: "Stock Return",
      icon: "icon-sale-return",
      route: "/stock/return",
      component: SaleHistory
    }
  ],
  settings: [
    {
      title: "Store Account",
      icon: "icon-time",
      route: "/settings/account",
      component: SaleHistory
    },
    {
      title: "Store Location",
      icon: "icon-pre-order",
      route: "/settings/location",
      component: SaleHistory
    },
    {
      title: "Receipt Template",
      icon: "icon-sale-return",
      route: "/settings/receipt-template",
      component: SaleHistory
    },
    {
      title: "Payment Method",
      icon: "icon-sale-return",
      route: "/settings/payment-method",
      component: SaleHistory
    },
    {
      title: "Tax",
      icon: "icon-sale-return",
      route: "/settings/tax",
      component: SaleHistory
    },
    {
      title: "Role",
      icon: "icon-sale-return",
      route: "/settings/role"
    },
    {
      title: "Income & Expense",
      icon: "icon-sale-return",
      route: "/settings/income-expense",
      component: SaleHistory
    }
  ]
};

export default dataSource;