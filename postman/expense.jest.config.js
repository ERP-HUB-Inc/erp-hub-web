const base = require('./item-types.jest.config');
module.exports = {
  ...base,
  testMatch: ['**/Finance/Expense/*.test.js', '**/Finance/Expense/*.test.jsx']
};
