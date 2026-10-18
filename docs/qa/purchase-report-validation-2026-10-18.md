# Purchase Report validation report

Date: 2026-10-18

Overall result: **Incomplete validation**. The whitespace check passed, but automated tests could not start because a local dependency is missing. Browser behavior and live API responses have not been verified in this run.

## Executed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Whitespace check for tracked Purchase Report and layout changes | PASS | `git diff --check` exited with code 0 and no output. This check does not inspect untracked files or verify application behavior. |
| Existing Purchase Report unit tests | BLOCKED | The test command exited with code 1 before executing tests: `Cannot find module 'dotenv'`. |
| Browser rendering and responsive layout | NOT RUN | No browser verification performed. |
| Live backend integration | NOT RUN | No live API requests performed. |
| Production build and lint | NOT RUN | No build or lint command performed. |

## Commands and output

Whitespace check:

```sh
git diff --check -- src/app/modules/pos/components/reports/Purchase src/layout/main-app.jsx
```

Result: exit code 0; no output.

Unit test command:

```sh
CI=true npm test -- --watchAll=false --runInBand --runTestsByPath src/app/modules/pos/components/reports/Purchase/purchaseReportOptions.test.js
```

Relevant output:

```text
Error: Cannot find module 'dotenv'
Require stack:
- node_modules/react-scripts/config/env.js
- node_modules/react-scripts/scripts/test.js
Node.js v20.5.0
```

No test assertions executed. The existing test file contains these four tests, all awaiting a successful runner startup:

1. Monthly trend sends only dates.
2. Supplier report keeps location but omits supplier ID.
3. Intelligence requests include only their supported threshold.
4. Unselected optional filters are omitted.

These tests cover request option construction. They do not verify table rendering, summary cards, column widths, or live API behavior.

## Manual review checklist

All items below are **pending**, not confirmed results.

- Purchase Trend shows no statistic cards.
- Purchase Trend columns appear in this order: Period, Orders, Quantity, Shipping Fee, Discount, Purchase Amount.
- For the supplied October sample, the trend row displays period `2026-10`, orders `8`, quantity `278`, shipping fee `19`, discount `0`, and purchase amount `10725`, with currency formatting where appropriate.
- Purchased Items and Suppliers show their statistic cards below their filters.
- Cost Changes, Stock Risk, and Purchase vs Sales show their respective API summary values.
- Product columns have sufficient room for long product and variant names; horizontal scrolling works on smaller screens.
- Stock Risk does not show the Returned column.
- Purchase vs Sales displays currency values and formats `purchaseSalesRatio` as a percentage without multiplying it again.
- Zero values, missing values, negative profit, loading, empty, and error states display correctly.
- The sidebar no longer contains the Analytics parent menu.

## Next validation step

Restore the project's local dependencies so the test runner can resolve `dotenv`, then rerun the command above. Complete the manual checklist using the provided API responses in the application.

Earlier messages reporting `git diff --check` passed referred to whitespace validation only; they were not claims that behavioral tests passed.
