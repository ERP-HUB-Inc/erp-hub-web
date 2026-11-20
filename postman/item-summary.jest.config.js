const base = require("./report-records.jest.config");

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    "\\.css$": "<rootDir>/node_modules/identity-obj-proxy"
  },
  testMatch: [
    "**/Inventory/Items/form/product-option.test.js",
    "**/Inventory/Items/form/product-type-options.test.js",
    "**/Inventory/Items/form/form.update.test.jsx",
    "**/Inventory/Items/form/item.detail.test.jsx",
    "**/Inventory/Items/form/item-list-sorting.test.jsx",
    "**/Inventory/Items/form/item-stock-filter.test.js",
    "**/Inventory/Items/form/item-summary.test.jsx",
    "**/Inventory/Items/form/item-selling-price.test.jsx",
    "**/Inventory/Items/form/item-variants.test.jsx",
    "**/Inventory/Items/form/edit-stock.test.jsx",
    "**/Inventory/Items/form/item-delete-confirm.test.jsx"
  ]
};
