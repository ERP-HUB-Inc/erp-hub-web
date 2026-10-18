# Stock Risk UI implementation and verification

Date: 2026-10-18

Requirement: `.ai/features/reports/stock-risk.md`.

## Implemented

- Dedicated Stock Risk layout with pale gray-blue background, white rounded toolbar/cards/table, and teal, amber, and red status styling.
- Date, store, supplier, and coverage policy filters retain existing query semantics. Coverage presets are 30, 60, 90, and 180 days with custom nonnegative input. Recalculate Run-Rate refreshes using the active filters and is disabled while loading.
- Five equal-height responsive cards use backend summary totals, not visible-page aggregates. All six existing summary fields remain represented through the five cards and the total-overstock note below them.
- All Items, Critical Risk, High Risk, and Healthy filter the available rows. Product/variant/SKU search supports Khmer text, and category badges reflect search results. Page resets on filters, category, and search changes; pagination clamps if refresh reduces results.
- Ten columns: Product & SKU, Purchased, Sold, Current Stock, Daily Velocity, Coverage Days, Target Policy, Excess Stock, Risk Level, and Suggested Action.
- Product names wrap, nullable SKUs have a fallback, and optional `categoryName`/`unitName` are displayed when supplied. Generic inventory icons are used rather than guessing product categories.
- Coverage, velocity, target stock, current stock, and excess stock come from backend fields. No current stock is calculated from purchased minus sold. No risk severity is inferred from coverage or zero sales.
- The supplied sample with stock 10, sold 0, daily sales 0, and null coverage displays **No Sales (∞)** / **Zero movement**, target 30 days / target stock 0, and +10 excess. Infinity is display text, not a numeric JSON value.
- Missing sales history remains unavailable; zero stock does not produce infinite coverage. Valid reported coverage remains authoritative and is not recalculated using rounded daily velocity.
- Suggested Action opens the existing item detail route as Review item or Monitor. There are no fake promotion, purchase hold, clearance, or reorder mutations. The existing route authentication/workflow remains responsible for access.
- Loading skeletons, empty/search states, unknown risk labels, retryable errors, horizontal scrolling, result ranges, and pagination are included. The Returned column remains removed.

## Summary mapping

| UI | Backend field | Notes |
| --- | --- | --- |
| Total Products | `summary.totalProducts` | Shows SKUs. |
| Healthy Stock | `summary.normalProducts` | Backend normal category. |
| Overstock Alert | `summary.highRiskProducts` | High-risk-only card, separate from critical. |
| Dead Stock Risk | `summary.criticalRiskProducts` | Caption identifies this as the backend critical category. No new >500-day or minimum-history rule is introduced. |
| Total Excess Units | `summary.totalExcessStock` | Reported quantity; no invented “pcs” suffix or valuation. Unit basis is identified as unavailable. |
| Total overstock flagged note | `summary.overstockProducts` | Preserves the total overstock aggregate without double-counting it as a mutually exclusive high-risk category. |

Risk strings `CRITICAL`, `HIGH`/`HIGH_RISK`, and `NORMAL`/`HEALTHY` map to distinct display groups. Unknown or absent labels stay unavailable and appear in All Items with a disclosure, rather than silently becoming healthy.

## Changed files

Paths are relative to the repository root.

- `src/app/modules/pos/components/reports/Purchase/StockRiskReport.jsx`: cards, category/search toolbar, table, pagination, empty/error states, and item review links.
- `src/app/modules/pos/components/reports/Purchase/StockCoverageFilter.jsx`: coverage presets and custom days.
- `src/app/modules/pos/components/reports/Purchase/stockRiskModel.js`: risk grouping, search, coverage display, and page ranges.
- `src/app/modules/pos/components/reports/Purchase/stockRiskModel.test.js`: ten Stock Risk behavior tests.
- `src/app/modules/pos/components/reports/Purchase/stockRisk.css`: feature-scoped responsive styling.
- `src/app/modules/pos/components/reports/Purchase/PurchaseReport.jsx`: dedicated tab integration.
- `src/app/modules/pos/components/reports/Purchase/PurchaseReportParts.jsx`: toolbar integration; removes the superseded Stock Risk summary.
- `src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.js`: removes superseded Stock Risk columns/summary definitions.

No API service, request parameters, unrelated report data logic, or navigation was changed.

## Backend data needed to complete the design

Current endpoint: `GET /report/purchases/intelligence/overstock`.

The existing fields support the core report. The following additions are **proposed names**, not an assumed new contract:

| Proposed data | Purpose | Current behavior |
| --- | --- | --- |
| `summary.totalExcessStockValue` and `summary.currencyCode` | Tied capital on the Total Excess card. Must use the established inventory valuation method. | Displays an explanatory dash. |
| Per-item `excessStockValue` with an agreed report/row currency | Capital locked by each row's excess inventory. | No per-row currency value is fabricated. |
| `summary.highRiskCoverageDays` and `summary.highRiskCoverageMetric` | The amber card's aggregate run-rate badge. Define whether it is weighted average, maximum, or another policy metric; use the complete filtered high-risk population. | Shows a Review badge instead of arbitrarily selecting one row's coverage. |
| Per-item `unitId` / `unitName`, plus `summary.quantityUnit` for a confirmed common normalized unit **or** `summary.excessStockByUnit` breakdown | Accurate quantity labels without adding incompatible UOMs under “pcs”. | Existing scalar total is shown as reported, with its unit basis unavailable; optional row unit names are already supported. |
| Per-item `categoryName` | Product/SKU category subtitle. | Already displayed if present; omitted when absent. |
| Per-item `nearestExpiryDate`, `daysToExpiry`, and relevant expiring quantity/lot context | Actual expiry warnings; do not use catalog shelf-life or a fabricated date. | Expiry messages are omitted. |
| An agreed `suggestedAction` type and required item/variant/workflow context, backed by existing promotion/PO permissions and rules | Create Clearance, Hold POs, Flash Promo, or justified Reorder PO. | Routes to the existing useful item detail view. No reorder is inferred just because coverage is below the overstock threshold. |
| `productOption` when required by the existing item workflow | Resolve the correct product/variant editor/detail context. | Passed through if present; otherwise uses the existing item route with `itemId`. Confirm the report's `itemId` is the editable inventory item ID. |

Also confirm/document these backend semantics before broadening calculations or category behavior:

- Whether `currentStock` is on-hand, available, or inventory position, and its authoritative stock-ledger/balance source.
- Eligible sales/returns, observation-day convention/timezone, pack-size/rounding/safety-stock rules for targets, critical thresholds, and minimum-history rules for new items. Current UI preserves returned values and risk; it does not introduce a 500-day critical rule.
- Whether the report returns normal/healthy products as well as overstock. If the endpoint only returns flagged rows, the Healthy detail tab cannot be completed merely from a summary count; provide a supported full-scope/risk query contract.
- Whether `items` is the complete report detail dataset. Current examples are unpaged. If the backend paginates, provide server totals plus category/search/page inputs before treating local row counts as report-wide totals. Cards already use backend summary totals.
- Missing history should be represented distinctly from confirmed zero sales, with unavailable coverage remaining null. The UI only shows No Sales (∞) when positive stock, zero daily velocity, and zero sales are explicitly provided and numeric coverage is unavailable.

## Verification results

| Check | Result |
| --- | --- |
| Focused unit tests | **PASS: 4 suites, 42 tests**, including 10 new Stock Risk cases. |
| Limited lint | **PASS** for undefined variables, semicolons, and double quotes on the six changed production JavaScript/JSX files. |
| Project-configured ESLint | **BLOCKED**: `eslint-plugin-react` cannot be resolved. No dependencies were installed. |
| Babel transforms | **PASS: 7 files**, including the new model test, using the existing env/React presets. |
| CSS parse and current changed-file whitespace | **PASS**. |
| Browser, keyboard, responsive, and live API integration | **NOT RUN**. No screenshot attachment was available for pixel comparison. |
| Full application build | **NOT RUN**. |

Unit command:

```sh
node_modules/.bin/jest --watchman=false --runInBand --config '{"testEnvironment":"node","testMatch":["**/stockRiskModel.test.js","**/costChangesModel.test.js","**/purchaseReportOptions.test.js","**/purchaseReportConfig.test.js"]}'
```

Output:

```text
PASS src/app/modules/pos/components/reports/Purchase/costChangesModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/stockRiskModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportOptions.test.js

Test Suites: 4 passed, 4 total
Tests:       42 passed, 42 total
Snapshots:   0 total
```

New tests cover the supplied zero-sales response, null/undefined/empty history, zero/missing stock, preservation of reported coverage, exact threshold display, confirmed zero coverage, mutually exclusive authoritative risk groups, unknown labels, Khmer/SKU/variant search, and pagination after result counts shrink.

## Pending manual review

1. Open Purchase Report → Stock Risk on desktop/tablet/mobile. Check five/two/one card columns, toolbar wrapping, long Khmer names, horizontal table scrolling, and keyboard focus.
2. Verify the supplied critical sample's No Sales display, actual current stock, target 0 / 30 Days, +10 excess, null SKU fallback, and critical badge.
3. Check 30/60/90/180-day presets and a custom threshold; confirm only `thresholdDays` changes in the report request and Recalculate Run-Rate is disabled during loading.
4. Search product, variant, and SKU; switch risk categories; paginate; then change report filters. Verify counts, page reset/clamping, and footer ranges agree.
5. Check absent summary metrics, no inventory, no history, unknown risk, and request failure/retry without misleading zeros or inferred critical status.
6. Confirm Review item and Monitor navigate to the correct existing authorized item detail. No price/PO/promotion mutation should occur from these links.
7. Confirm Cost Changes and the other report tabs retain their filters and table behavior.

## Follow-up: tab alignment correction

The report-specific classes were originally applied directly to Ant Design's animated `TabPane` elements. Cost Changes had negative horizontal margins that persisted on its inactive pane. The tab strip translates by pane index and assumes each pane occupies exactly 100% of the content width, so the inactive Cost Changes margins shifted the later Stock Risk pane. Removing Stock Risk's own margins did not address that preceding pane.

Both feature classes now belong to inner content wrappers, rendered only for the active report. The actual tab panes retain their default dimensions. Stock Risk uses the same internal margins/padding as Cost Changes without changing the animated strip's geometry.

Verification: inspected the installed Ant Design/rc-tabs layout rules and translation logic; the limited lint and tracked whitespace checks passed. Browser verification remains pending. Manually switch Cost Changes → Stock Risk → Purchase vs Sales and back, checking left/right alignment and horizontal table scrolling.

## Follow-up: confirmed backend valuation fields

The developer confirmed the backend already returns `summary.totalExcessStockValue`, `summary.currencyCode`, and `summary.valuationUnavailableProducts`. Its existing basis is excess stock multiplied by `ProductVariant.cost`. The full total is null when valuation or client currency is unavailable, and confirmed zero excess returns 0.

The hardcoded Tied capital placeholder has been replaced with those response values. The supplied `{ totalExcessStockValue: 0, currencyCode: "USD", valuationUnavailableProducts: 0 }` displays **USD 0.00**. Missing totals display a dash with a reason; missing product valuations use the unavailable count, and absent currency is explained without assuming USD. No partial total or frontend cost calculation is introduced.

Verification: **4 suites passed, 47 tests passed** using the unit command above. The five new unit cases cover a positive aggregate, confirmed zero, unavailable product costs, missing currency, and an absent aggregate. Limited lint and whitespace checks passed. Browser rendering and live store values remain unverified.
