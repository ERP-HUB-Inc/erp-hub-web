const base = require("./item-summary.jest.config");

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    "^@components/(.*)$": "<rootDir>/src/components/$1"
  },
  testMatch: ["**/Inventory/Items/import/*.test.js", "**/Inventory/Items/import/*.test.jsx"]
};
