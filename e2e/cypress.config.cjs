const { defineConfig } = require("cypress");
const { loadConfig } = require("./config/load-config.cjs");

const localSettings = loadConfig();

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "results/html",
    reportFilename: "index",
    reportPageTitle: "MarketChain ERP - E2E Report",
    reportTitle: "MarketChain ERP - E2E Report",
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    overwrite: true,
    removeJsonsFolderAfterMerge: false
  },
  viewportWidth: 1440,
  viewportHeight: 900,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 30000,
  retries: { runMode: 1, openMode: 0 },
  video: false,
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  e2e: {
    baseUrl: localSettings.baseUrl,
    specPattern: "specs/**/*.cy.js",
    supportFile: "support/e2e.js",
    fixturesFolder: "fixtures",
    testIsolation: true,
    setupNodeEvents(on, config) {
      if (config.reporter === "cypress-mochawesome-reporter") {
        require("cypress-mochawesome-reporter/plugin")(on);
      }
      on("task", {
        getLoginCredentials: localSettings.getLoginCredentials
      });
    }
  }
});
