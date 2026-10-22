const base = require("./report-records.jest.config");

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    "\\.css$": "<rootDir>/node_modules/identity-obj-proxy"
  },
  testMatch: [
    "**/Inventory/Items/form/item-summary.test.jsx",
    "**/Inventory/Items/form/item-selling-price.test.jsx"
  ]
};
