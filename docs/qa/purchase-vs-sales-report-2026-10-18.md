# Purchase vs Sales UI implementation and verification

Date: 2026-10-18

Requirement: `.ai/features/reports/purchase-vs-sales.md`.

## Implemented

- Dedicated Purchase vs Sales content with pale gray-blue background, rounded white cards/table, financial colors, icon tiles, and card accent strips. Spacing belongs to an inner wrapper, preserving Ant Design's animated tab-pane widths.
- Four responsive cards: Sales Revenue, Purchase Spend, Gross Profit, and Stock Alerts & Health. The first three use the existing report summary. The stock-health tiles explicitly show unavailable data; period activity counts are not relabeled as fast sales, overstock, or new receipts.
- The screenshot's financial labels were adjusted to match the supplied contract. Sales/purchase documents do not establish actual cash receipts/payments. Purchase spend is separate from sales cost/COGS; gross profit is not called net profit because expense data is absent.
- Existing summary fields remain visible across cards and the compact period summary: product count, sales/purchase quantities and amounts, sales cost, gross profit, purchase/sales ratio, quantity/amount differences, and the four supplied activity counts.
- Six columns in the requested order: Product & SKU; Units (Bought vs Sold); Financial Flow; Profit & Margin; Inventory Status & Next Step; Action.
- Product names/variants support wrapping and Khmer text, nullable SKUs use a fallback, and actual category names display if supplied. Product icons are generic because product-type/image metadata is not in the supplied response.
- Bought/sold segments use quantity divided by the combined bought + sold quantity. Both-zero inputs produce an empty neutral bar. Missing or negative/net-return quantities preserve their values and use a neutral bar rather than invalid percentages.
- Period movement uses the supplied quantity difference, with a bought-minus-sold fallback when both quantities are known. Movement is never labeled available stock or safe reserve.
- Financial Flow shows purchase amount, sales revenue, and Sales Cost (COGS) separately. Gross profit is the backend-provided amount; margin uses that same gross profit divided by positive sales revenue.
- Confirmed no-sale rows with zero/unknown profit show a dash and Awaiting Sale. Confirmed break-even stays zero. Missing profit stays unavailable. Nonpositive or missing revenue never produces division by zero or an infinite margin. A reported nonzero loss is not hidden merely because the sales quantity is zero.
- Realized loss takes priority in the row's period insight. Other rows show actual activity status with a request to review current stock. The UI does not infer reorder urgency, healthy buffer, current below-cost selling prices, new receipts, FIFO, or legacy lots from period totals.
- View Item uses `/inventories/items/view/{itemId}?productOption=0`. Missing item IDs disable the action; variant IDs are never substituted. Existing route authentication/workflow is reused; no price, promotion, or PO mutation was added.
- Existing date/location/supplier query behavior is retained. Local product/variant/SKU search, activity filter, and optional category filter operate on the returned report details. No unsupported API filters or transaction-history requests were added.
- Footer includes ranges, 10/20/50 rows per page, first/previous/numbered/next/last controls, and selected teal pages. Filtering resets the page, and ranges clamp when results shrink.
- Loading skeletons, stable table height, empty/search states, unavailable indicators, and retryable errors are included.

## Financial mapping

| UI | Existing API field / calculation |
| --- | --- |
| Sales Revenue | `summary.salesAmount` |
| Units sold / products | `summary.salesQuantity` / `summary.productCount` |
| Purchase Spend | `summary.purchaseAmount` |
| Units purchased | `summary.purchaseQuantity` |
| Gross Profit | `summary.grossProfit` |
| Sales Cost (COGS) | `summary.salesCost` |
| Gross margin | `grossProfit / salesAmount × 100`, only for positive revenue and known profit |
| Other period totals | Existing `purchaseSalesRatio`, `quantityDifference`, `amountDifference`, and activity counts |
| Row financial values | Existing `purchaseAmount`, `salesAmount`, `salesCost`, and `grossProfit` |

Monetary output reuses `Util.formatCurrency`; `summary.currencyCode` is used if supplied. No USD symbol or currency conversion is invented when it is absent.

For the previously supplied XS Max Board row, 15 bought versus 18 sold gives the reported -3 movement and segments of approximately 45.45% / 54.55%. The supplied sales revenue 144, sales cost 976.83, and gross profit -832.83 yield -578.4% displayed gross margin. This is a realized period loss; it does not prove the current retail price is below current unit cost.

## Backend dependencies

Endpoint remains `GET /report/purchases/intelligence/purchase-vs-sales`.

The following data is absent from the response examples shared so far. This is not a claim that the backend code lacks these fields; if they already exist, their exact response shape should be confirmed and connected. Suggested names below are proposals, not new required query parameters.

1. **Stock-health summary:** provide verified counts for selling-fast products, overstock products, and new-restock products, with stable corresponding row signal codes and definitions. For example, `summary.stockHealth` could contain `sellingFastProducts`, `overstockProducts`, and `newRestockProducts`. Return null when unavailable and 0 only for confirmed zero. Define overlap and filter behavior; `salesAheadProducts`, `purchaseAheadProducts`, and `purchaseOnlyProducts` are period comparisons and cannot be substituted for these counts.
2. **Inventory insights:** actual current/available stock from the established stock source, unit basis, sales velocity/coverage, and backend policy results. Reorder recommendations need applicable lead time, safety/reorder levels, open PO context, and recommended quantity. Prefer backend-defined primary insight/reason and supporting signals with a documented priority when several issues apply. Do not make the frontend reproduce competing inventory policies.
3. **Receipt/display history:** confirmed receipt dates, the definition of a new-restock window, and actual display status if the UI should claim New Batch / On Display. Purchased during the period is insufficient evidence for these labels.
4. **Current pricing and cost detail:** current retail price and comparable current unit cost to justify price-review claims; actual allocated lot/batch costs and valuation method to justify Old Batch Cost or FIFO audit wording. Realized `grossProfit < 0` alone supports review of profitability, not these more specific claims.
5. **Catalog, units, and currency:** actual `categoryName` (optionally category ID), row reporting unit, and a documented normalized/compatible summary quantity basis. Optional category display/filtering already works when category names are present. Confirm the report's currency/conversion basis and expose `summary.currencyCode` if needed for explicit currency labels.
6. **Workflow integrations:** supported action types and scoped identifiers for Restock PO, View Stock, Adjust Price, Inspect Cost, and Promote. Confirm existing routes/dialogs and authorization. Reorder must be supported by actual policy; actions must open reviewable flows without immediately writing data. Current View Item remains useful until these integrations exist.
7. **Dataset completeness/pagination:** existing examples expose an unpaged `items` array. If server pagination is used or introduced, provide supported search/activity/category/page inputs and full totals together. The current summary uses backend totals, while local detail counts/filtering cover available rows only.

No export control existed in the current Purchase vs Sales tab; older purchase report/export modules were not modified.

## Changed files

Paths are relative to the repository root.

| File | Purpose |
| --- | --- |
| `src/app/modules/pos/components/reports/Purchase/PurchaseSalesReport.jsx` | Dedicated report state, detail filters, table, pagination, and error state. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseSalesCards.jsx` | Four summary cards and preserved period totals. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseSalesCells.jsx` | Six readable column/cell renderers and item navigation. |
| `src/app/modules/pos/components/reports/Purchase/purchaseSalesModel.js` | Financial display states, unit comparisons, period insights, filters, and page ranges. |
| `src/app/modules/pos/components/reports/Purchase/purchaseSalesFormatters.js` | Existing currency/quantity utility integration and signed displays. |
| `src/app/modules/pos/components/reports/Purchase/purchaseSalesModel.test.js` | Sixteen financial/quantity/filter/pagination cases. |
| `src/app/modules/pos/components/reports/Purchase/purchaseSales.css` | Feature-scoped responsive styling. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseReport.jsx` | Dedicated report integration with inner wrappers; replaces the expanding report-selection ternary with a component map. |
| `src/app/modules/pos/components/reports/Purchase/PurchaseReportParts.jsx` | Matching toolbar styling and removal of superseded activity summary. |
| `src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.js` | Removes superseded Purchase vs Sales columns and summary definitions. |

No API service/request, menu, backend accounting policy, or unrelated report data logic was changed.

## Verification

| Check | Result |
| --- | --- |
| Focused unit tests | **PASS: 5 suites, 63 tests**, including 16 new Purchase vs Sales cases. |
| Limited ESLint | **PASS**: undefined variables, semicolons, and double quotes across eight changed production JavaScript/JSX files. |
| Project-configured ESLint | Still blocked by the previously observed missing `eslint-plugin-react`; the full configured lint is not claimed to pass. |
| Babel transforms | **PASS: 9 files**, including the new test, using the existing React/env presets. |
| CSS parsing and current changed-file whitespace | **PASS**. |
| Browser, responsive, keyboard, live API, and item navigation | **NOT RUN**. No screenshot attachments were available for pixel comparison. |
| Full production build | **NOT RUN**. |

Test command:

```sh
node_modules/.bin/jest --watchman=false --runInBand --config '{"testEnvironment":"node","testMatch":["**/purchaseSalesModel.test.js","**/stockRiskModel.test.js","**/costChangesModel.test.js","**/purchaseReportOptions.test.js","**/purchaseReportConfig.test.js"]}'
```

Output:

```text
PASS src/app/modules/pos/components/reports/Purchase/costChangesModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseSalesModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/stockRiskModel.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportConfig.test.js
PASS src/app/modules/pos/components/reports/Purchase/purchaseReportOptions.test.js

Test Suites: 5 passed, 5 total
Tests:       63 passed, 63 total
Snapshots:   0 total
```

Tests cover backend profit preservation, separation of purchase spend from COGS/profit, matching margin denominator, no-sale/zero/missing/loss/refund cases, zero-safe quantity bars, reported movement, truthful period insights, Khmer/SKU/variant/category/activity filtering, and page-size/range/clamping behavior.

## Pending manual review

1. Check four/two/one cards on desktop/tablet/mobile, table scrolling, long Khmer names, and actual currency/quantity formatting.
2. Switch Cost Changes → Stock Risk → Purchase vs Sales and back. Confirm panel spacing remains inside each tab and later panes are not shifted.
3. Check profitable, loss, break-even, no-sales, missing-profit, zero-revenue, and net-return rows. Confirm no false stock/reorder/current-price/FIFO claims.
4. Confirm the supplied summary values: sales 6,788.20, purchases 8,415.00, COGS 5,641.83, gross profit +1,146.37, and approximately 16.9% gross margin. Compare the period ratios/differences/activity counts with the response.
5. Search by English/Khmer product, SKU, and variant; change activity/category; change rows per page; use first/last controls; then change date/location/supplier and verify page reset.
6. Verify no-data/error/retry/loading states and that unavailable stock-health tiles remain informational rather than appearing to be zero alerts.
7. Confirm View Item uses the item's `itemId` with `?productOption=0` and the existing authorized route. Returning from the existing workflow remounts/refetches the report through its existing lifecycle.

## Follow-up: confirmed stock-health summary

The developer supplied `summary.stockHealth.sellingFastProducts`, `overstockProducts`, and `newRestockProducts`. The three Stock Alerts & Health tiles now read those fields. The supplied sample displays Selling Fast **0**, Too Much Stock **5**, and New Restock **0**. Confirmed zeros stay visible; null/missing counts retain a dash and an unavailable tooltip. Available counts no longer display the old unavailable tooltip/footer.

Tiles remain informational because per-row signal flags needed for corresponding product filtering have not yet been provided. No counts are inferred from period activity statuses. This change affects the summary card only; limited lint and whitespace checks passed. The previously recorded 63 unit tests were not rerun for this display-only mapping, and live/browser verification remains pending.
