const path = require("path");

module.exports = {
  rootDir: path.resolve(__dirname, ".."),
  testEnvironment: "jsdom",
  watchman: false,
  transform: { "^.+\\.jsx?$": "<rootDir>/node_modules/react-scripts/node_modules/babel-jest" },
  moduleNameMapper: {
    "^axios$": "<rootDir>/node_modules/axios/dist/node/axios.cjs",
    "\\.css$": "<rootDir>/node_modules/identity-obj-proxy"
  },
  testMatch: [
    "**/layout/sidebar-health-status.integration.jsx",
    "**/layout/sidebar-navigation.test.js",
    "**/stateless/logo-text-only.test.jsx"
  ]
};
