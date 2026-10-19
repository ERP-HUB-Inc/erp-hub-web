const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, ".."),
  testEnvironment: "jsdom",
  watchman: false,
  transform: {
    "^.+\\.jsx?$": "<rootDir>/node_modules/react-scripts/node_modules/babel-jest"
  },
  moduleNameMapper: {
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@helper/(.*)$": "<rootDir>/src/helper/$1",
    "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs"
  },
  testMatch: [
    "**/Purchase/*.test.js",
    "**/Purchase/PurchaseReportParts.test.jsx",
    "**/stateful/RemoteRecordSelect.integration.jsx"
  ]
};
