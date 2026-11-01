const base = require('./business-health.jest.config');

module.exports = { ...base, testMatch: [...base.testMatch, '**/Setting/Modules/SalesTarget/*.test.jsx'] };
