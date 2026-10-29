const base = require('./item-summary.jest.config');

module.exports = {
  ...base,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@router/(.*)$': '<rootDir>/src/router/$1'
  },
  testMatch: [
    '**/Setting/Modules/ItemType/*.test.jsx',
    '**/Setting/Modules/ItemType/*.test.js',
    '**/Setting/ModuleSettings.test.jsx',
    '**/Setting/module-settings-model.test.js',
    '**/Setting/SettingPage.test.jsx'
  ]
};
