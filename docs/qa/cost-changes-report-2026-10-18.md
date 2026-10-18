# Cost Changes UI implementation and verification

Date: 2026-10-18

Requirement: `.ai/features/reports/cost-changes-report.md`.

## Implemented

- Cost Changes has its own pale gray-blue background, rounded white toolbar, four responsive cards, red/teal status colors, and white table panel.
- Date, store, supplier, and minimum-variance controls retain the existing request contract. The comparison reference uses the API's `period.current` and `period.previous`, not an assumed previous day. Recalculate is disabled while loading.
- A price-hike alert uses eligible returned rows. It highlights the largest increase, summarizes other qualifying SKUs, and can be dismissed. Its identity changes when filter, period, cost, or quantity data changes. Update Retail Price opens the existing item edit route for the selected product; it does not submit a price change. Returning to the report reloads data through its existing mount behavior.
- Cards use backend `affectedProducts`, `increasedProducts`, `decreasedProducts`, and `unchangedProducts`. Maximum increase and estimated batch exposure/savings are scoped to eligible listed SKUs. No daily exposure, monitored percentage, margin, or retail price is fabricated.
- Four category buttons and product/variant/SKU search filter the returned report rows. Button counts reflect search. All Affected includes increased and decreased rows only. Pagination resets on filters, search, and category changes.
- Exact positive/negative threshold boundaries count as increased/decreased. Zero remains stable, including at a zero threshold. A missing, nonpositive, or invalid previous cost is excluded and disclosed; a missing current cost or percentage is also excluded.
- The six columns are Product & SKU, Batch Inbound Qty, Previous Cost, Current Cost, Variance ($ & %), and Gross Margin Impact. Product details wrap; the table scrolls horizontally. Missing margins display an explanatory dash.
- Loading skeletons, no-baseline/search/category empty messages, an error retry action, weighted-cost explanation, result counts, and pagination are included.

## Changed files

Paths below are relative to the repository root.

| File | Change |
| --- | --- |
| `src/app/modules/pos/components/reports/Purchase/CostChangesReport.jsx` | Dedicated Cost Changes UI, alert, cards, category/search controls, table, and pagination. |
| `src/app/modules/pos/components/reports/Purchase/costChangesModel.js` | Numeric guards, category boundaries, grouping, search, batch impact, and alert identity. |
| `src/app/modules/pos/components/reports/Purchase/costChangesModel.test.js` | Behavior tests for the model. |
| `src/app/modules/pos/components/reports/Purchase/costChanges.css` | Styles scoped to Cost Changes. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseReport.jsx` | Integrates the dedicated tab and comparison-period prop. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseReportParts.jsx` | Enhances the Cost Changes toolbar and removes the superseded summary block. |
| `src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.js` | Removes superseded Cost Changes column definitions. |

No API service, request parameters, backend contract, or menu was changed for this enhancement.

## Verification results

| Check | Result | What it establishes |
| --- | --- | --- |
| Focused unit tests | **PASS: 2 suites, 17 tests** | Cost category boundaries, zero/missing baseline behavior, search, batch impact, dismissal identity, and existing request options work for tested inputs. |
| Project ESLint configuration | **BLOCKED** | ESLint cannot resolve `eslint-plugin-react`; the full configured lint check did not run. |
| Limited ESLint check | **PASS** | The changed production JavaScript/JSX files pass the explicit undefined-variable, semicolon, and quote rules with the default JSX-capable parser. This does not replace the missing React plugin checks. |
| Babel transforms | **PASS: 6 files** | The changed production JavaScript/JSX and new model test compile with the existing React/env presets. This is not a full application build. |
| CSS parsing | **PASS** | `costChanges.css` parses with PostCSS. This does not verify browser layout. |
| Whitespace | **PASS** | Checked tracked diffs and explicitly checked current changed JavaScript/JSX, including new files. |
| Browser / screenshot / keyboard / responsive checks | **NOT RUN** | Actual visual appearance and interactions remain to be reviewed in the application. No screenshot attachment was available in this request. |
| Live API integration and pricing navigation | **NOT RUN** | No live requests, price writes, or authenticated workflow verification performed. |
| Full application build | **NOT RUN** | The application bundle was not built. |

Successful unit test command:

```sh
node_modules/.bin/jest --watchman=false --runInBand --config '{"testEnvironment":"node","testMatch":["**/costChangesModel.test.js","**/purchaseReportOptions.test.js"]}'
```

Output:

```text
PASS src/app/modules/pos/components/reports/Purchase/costChangesModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportOptions.test.js

Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Snapshots:   0 total
```

Limited lint command:

```sh
node_modules/.bin/eslint --no-eslintrc --env browser,node,es6 \
  --parser-options '{"ecmaVersion":2020,"sourceType":"module","ecmaFeatures":{"jsx":true}}' \
  --rule 'no-undef:error' --rule 'semi:[error,always]' --rule 'quotes:[error,double]' \
  src/app/modules/pos/components/reports/Purchase/CostChangesReport.jsx \
  src/app/modules/pos/components/reports/Purchase/costChangesModel.js \
  src/app/modules/pos/components/reports/Purchase/PurchaseReport.jsx \
  src/app/modules/pos/components/reports/Purchase/PurchaseReportParts.jsx \
  src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.js
```

## Backend dependencies for the complete design

Current endpoint: `GET /report/purchases/intelligence/price-increase`.

1. **Complete variance categories:** The developer has now confirmed signed `minChangePercent` support: negative values such as `-10` and `-20` request cost decreases. The filter supports both signs. A confirmed contract is still needed to return both directions and stable details together, plus threshold-consistent increased/decreased/stable/affected totals. Do not assume omitting the threshold or setting it to zero returns all categories. The UI distinguishes summary totals from available row counts.
2. **Monitored and comparable totals:** Supply the total monitored SKU count and the count without a valid baseline, with a defined denominator for affected/stable percentages. Existing `unchangedProducts` must be clarified as exact zero change versus the selected stability band. The UI preserves that backend count and does not relabel it as a computed within-band total.
3. **Gross margin impact — integrated:** The developer supplied `sellingPrice`, `previousGrossMarginPercent`, `currentGrossMarginPercent`, and `pricingBasis`. The alert and table now consume these values. Margins are not recalculated from costs. `CURRENT_RETAIL` is disclosed as the current retail price basis; absent current margin data still receives an explanatory fallback.
4. **Multiple locations:** The supplied contract supports one `locationId`. Confirm a list parameter and its tenant/branch authorization semantics before enabling multi-store selection. The UI retains a single store or all stores.
5. **Supplier and unit detail:** Current item examples omit `supplierName` and `unitName`. Optional display support exists, but the UI does not invent a supplier or append “pcs” when absent. Define aggregation/display behavior when one SKU has several suppliers.
6. **Exact exposure and savings:** Current estimates use reported `changeAmount × currentQuantity` for listed rows, which may already be rounded. Provide backend aggregates if report-wide precision or full-dataset totals are required. Daily exposure additionally needs an actual daily quantity/forecast; the UI only labels batch exposure.
7. **Pricing context:** The item edit route is reused using `itemId` and `productOption` when supplied. Confirm report IDs identify the editable inventory item and include `productOption` where the existing workflow requires it. The specific affected variant still needs to be selected in the existing item editor; no direct price mutation was added.
8. **Future server pagination:** The current examples expose an unpaged `items` list. If this changes, supply server totals and category/search/page inputs together; current local category counts must not be treated as full-dataset counts for a server-paged response.

These dependencies are recorded for backend implementation; no new response fields or query parameters were silently introduced.

## Pending manual review

- Open Purchase Report → Cost Changes on desktop, tablet, and mobile; verify four/two/one card columns, filter wrapping, readable Khmer product names, and horizontal table scrolling.
- Confirm the comparison reference matches API dates, especially a previous comparable period that is not the previous calendar month/day.
- Check the supplied sample: XS Max Board, SKU-0001, previous/current quantities 5/15, costs 4.50/26.33, difference +21.83, and +485.2% display from the API's 485.19%.
- Search by product and SKU, change category, paginate, then change filters; confirm rows, counts, and page reset agree.
- Dismiss the alert, refresh unchanged data, then change costs or filters; confirm dismissal persists only for unchanged alert data while the tab remains mounted.
- Confirm item editor navigation resolves the correct item/variant and the existing authentication/authorization workflow applies. Do not submit a price change during UI review unless explicitly intended.
- Check loading, successful zero results, missing baseline, request failure/retry, and unavailable pricing states.

## Follow-up: signed decrease filters

Implemented after the developer confirmed negative query support:

- A preset selector describes the business intent: Increase ≥ 5/10/20/50%, Decrease ≥ 5/10/20/50%, plus the existing zero threshold. The custom signed percentage input preserves arbitrary thresholds.
- Selecting Decrease ≥ 10% sends `minChangePercent=-10`; selecting Decrease ≥ 20% sends `minChangePercent=-20`. Other query fields remain unchanged.
- Negative variance survives URL initialization and reload. Stock Risk's separate days threshold remains nonnegative.
- Local category comparisons and the displayed ± band use the threshold's absolute magnitude. Negative query values therefore cannot incorrectly classify small changes as qualifying decreases.
- Switching the query's sign returns the local table to All Affected, preventing a previously selected opposite-direction category from hiding the new results.
- Added `CostVarianceFilter.jsx` and `purchaseReportConfig.test.js`; updated the filter integration, numeric parsing, category model, styling, and regression tests.

Follow-up verification: **3 suites passed, 23 tests passed**. The limited lint check also passed. Full configured lint remains blocked by the previously reported missing React plugin. Browser behavior and live negative-threshold API calls remain unverified.

```sh
node_modules/.bin/jest --watchman=false --runInBand --config '{"testEnvironment":"node","testMatch":["**/costChangesModel.test.js","**/purchaseReportOptions.test.js","**/purchaseReportConfig.test.js"]}'
```

```text
PASS src/app/modules/pos/components/reports/Purchase/costChangesModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportOptions.test.js

Test Suites: 3 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total
```

Pending manual checks: choose Decrease ≥ 10% and ≥ 20%, inspect the signed request query, enter a custom `-12.5%`, reload the URL, and verify local category counts/boundaries and the positive-only Stock Risk days control.

## Follow-up: backend gross margin fields

Integrated the supplied response fields in the table and price-hike alert:

```json
{
  "sellingPrice": 8,
  "previousGrossMarginPercent": 25,
  "currentGrossMarginPercent": 61.54,
  "pricingBasis": "CURRENT_RETAIL"
}
```

- This sample displays **61.54% (25.00% previous)**, with teal emphasis for the improved margin. The pricing tooltip identifies **Current retail price: 8.00** using the existing currency formatter.
- Declining or negative current margins receive red emphasis. Equal margins show “unchanged”. Confirmed zero margins remain zero; missing current margins retain the unavailable state and missing previous margins are identified separately.
- The alert shows the current and previous supplied margins and retail price basis without assuming the margin was squeezed.
- Dismissed alerts reappear when selling price, margin percentages, or pricing basis changes.
- Backend percentages are treated as authoritative; no new selling-price or cost calculation was introduced.

Verification: **3 suites passed, 32 tests passed** using the follow-up Jest command above. New tests cover the supplied margin values, unchanged/missing/zero/negative margins, and pricing-related dismissal resets. Limited lint and tracked whitespace checks passed. Full configured lint remains blocked by the missing React plugin; browser and live API checks remain pending.
