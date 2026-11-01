const base = require('./item-types.jest.config');

module.exports = {
  ...base,
  testMatch: [
    '**/Setting/Modules/ExpenseCategory/*.test.jsx',
    '**/Setting/ModuleSettings.test.jsx',
    '**/Setting/module-settings-model.test.js',
    '**/Setting/SettingPage.test.jsx'
  ]
};
