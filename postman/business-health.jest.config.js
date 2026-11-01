const base = require('./item-types.jest.config');

module.exports = {
  ...base,
  testMatch: [
    '**/Setting/Modules/BusinessHealth/*.test.jsx',
    '**/Setting/ModuleSettings.test.jsx',
    '**/Setting/module-settings-model.test.js',
    '**/Setting/SettingPage.test.jsx'
  ]
};
