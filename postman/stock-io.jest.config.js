const base = require("./report-records.jest.config");

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    "^@components/stateful$": "<rootDir>/src/components/stateful",
    "^@router/(.*)$": "<rootDir>/src/router/$1",
  },
  testMatch: [
    "**/StockIO/form/*.test.js",
    "**/StockIO/form/*.test.jsx",
    "**/stateful/SelectItem.test.jsx",
    "**/services/StockIOService.test.js",
  ],
};
