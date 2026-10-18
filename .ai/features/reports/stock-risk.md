Implement or enhance my existing **Overstock Risk report** to closely match the attached screenshot.

First read the existing design system Markdown, frontend/backend rules, API conventions, and applicable project instructions. Inspect the existing Overstock Risk implementation and reuse its services, components, data models, permissions, and formatting utilities.

Implement this in the existing application. Preserve unrelated reports and navigation.

## 1. Layout and styling

- Pale gray-blue page background.
- White rounded filter toolbar, statistic cards, tab/search toolbar, and table container.
- Subtle borders/shadows and consistent spacing.
- Dark navy primary text and muted secondary text.
- Teal for healthy stock, amber/brown for high risk, and red for critical risk.
- Reuse existing design tokens and icons.
- Preserve readable Khmer and English typography.
- Match every visible section in the screenshot.
- Responsive cards and toolbars; horizontally scrollable table on smaller screens.

## 2. Top filter toolbar

Include, in this order:

1. Date-range picker with calendar icon.
   - Reference: 01/10/2026 ~ 18/10/2026.
2. Store/hub selector with warehouse icon.
   - Reference: All stores & hubs (Global).
3. Supplier selector with supplier icon.
   - Reference: All suppliers (Unfiltered).
4. Coverage-policy selector with hourglass icon.
   - Reference: Target > 60 days of sales.
5. Teal **Recalculate Run-Rate** button with refresh icon.

Use actual selected values and configured business timezone.

Clarify the policy selector as “Overstock threshold: >60 days” if that better expresses the existing business rule.

Recalculate must refresh the report using all active filters, show loading, and prevent duplicate requests. Respect tenant, branch, location, and supplier scope.

## 3. Five statistic cards

Use equal-height cards with uppercase headings, top-right icon tiles, large values, supporting text, and badges matching the screenshot.

### Total Products
- Heading: TOTAL PRODUCTS.
- Archive/storage icon.
- Value: 5.
- Inline unit: SKUs.
- Description: Active inventory monitor.

### Healthy Stock
- Heading: HEALTHY STOCK.
- Teal check-circle icon tile.
- Value: 2 in dark teal.
- Mint badge: Balanced.
- Description: Run-rate matches capacity.

### Overstock Alert
- Heading: OVERSTOCK ALERT.
- Amber warning icon tile.
- Value: 1 in amber/brown.
- Pale amber badge: 61.7d Run.
- Description: Exceeds 60-day turnover.

### Dead Stock Risk
- Heading: DEAD STOCK RISK.
- Red risk/shield-alert icon tile.
- Value: 2 in dark red.
- Pale red badge: Urgent.
- Description: >500d or zero turnover.

### Total Excess Units
- Subtle mint-tinted card background.
- Heading: TOTAL EXCESS UNITS in teal.
- Dollar icon inside a solid teal rounded square.
- Value: 107 in teal.
- Inline unit: pcs.
- Bottom-left label: Tied capital.
- Bottom-right value: ~$2,450.00.

Use real aggregate data, not hardcoded reference values.

If several units of measure exist, do not combine incompatible units under “pcs”. Use the application’s normalized unit policy or show an appropriate breakdown.

For the overstock card’s run-rate badge, use a clearly defined metric from the existing report; do not arbitrarily select one row’s coverage.

## 4. Risk tabs and search toolbar

Include:

- All Items with count badge 5, selected with pale blue background.
- Critical Risk with red dot and count badge 2.
- High Risk with amber/brown dot and count badge 1.
- Healthy with dark teal dot and mint count badge 2.
- Right-aligned search field with search icon:
  “Search SKU, product name…”

Tabs filter actual results. Counts must reflect the current report scope, with search behavior consistent across the application.

Use mutually exclusive risk categories so rows and totals agree. Reset pagination when tabs, filters, or search change.

## 5. Complete report table

Columns in this exact order:

1. PRODUCT & SKU
2. PURCHASED
3. SOLD
4. CURRENT STOCK
5. DAILY VELOCITY
6. COVERAGE DAYS
7. TARGET POLICY
8. EXCESS STOCK
9. RISK LEVEL
10. SUGGESTED ACTION

Use a lightly tinted uppercase header, generous readable rows, subtle alternating backgrounds, rounded outer container, and aligned numeric columns.

### Product & SKU
- Product-specific icon inside a pale rounded square.
- Bold product name.
- Secondary line with SKU badge and category separated by a dot.
- Support long names and Khmer text without overlap.

### Purchased
- Purchased/received quantity according to the existing reporting definition.

### Sold
- Sold quantity for the selected observation period.
- Red text for zero sales where appropriate.

### Current Stock
- Bold current inventory quantity from the stock ledger.
- Do not derive it simply as purchased minus sold.

### Daily Velocity
- Numeric value followed by /day.
- Two decimal places where appropriate.
- Risk-aware text color.

### Coverage Days
- Bold days value.
- Smaller explanatory line below.
- Zero-sales state: No Sales (∞), with Zero movement underneath.
- Do not serialize Infinity as an invalid JSON number.

### Target Policy
- Target coverage, such as 60 Days.
- Smaller target stock quantity underneath: Target: 10.

### Excess Stock
- Signed positive excess quantity, such as +87 Units.
- Teal 0 Units for no excess.
- Smaller tied-capital or expiry detail underneath where available.

### Risk Level
- Compact pill badge with dot:
  - CRITICAL in red.
  - HIGH RISK in amber.
  - HEALTHY in teal.
- Communicate status with text as well as color.

### Suggested Action
- Compact action button matching the row’s context.
- Preserve permissions and existing workflow integrations.

## 6. Screenshot reference rows

These are development visual examples only. Do not use them as production data or force inconsistent calculations to match them.

### Row 1
- XS Max Logic Board Replacement.
- SKU: PV-07286.
- Category: Mobile Hardware.
- Processor icon.
- Purchased: 100.
- Sold: 3.
- Current stock: 97.
- Daily velocity: 0.17/day.
- Coverage: 582 Days.
- Secondary coverage: ~19.4 Months.
- Target policy: 60 Days.
- Target stock: 10.
- Excess: +87 Units.
- Tied capital: ~$1,914 locked.
- Risk: CRITICAL.
- Action: Create Clearance.

### Row 2
- 11 Pro Max Motherboard Assembly.
- SKU: PV-04603.
- Category: Mobile Hardware.
- Component/board icon.
- Purchased: 465.
- Sold: 105.
- Current stock: 360.
- Daily velocity: 5.83/day.
- Coverage: 61.7 Days.
- Secondary coverage: +1.7d over target.
- Target policy: 60 Days.
- Target stock: 350.
- Excess: +10 Units.
- Tied capital: ~$380 locked.
- Risk: HIGH RISK.
- Action: Hold POs.

### Row 3
- IRVINS product with the Khmer/English name shown in the screenshot, ending in 105g.
- Use the actual catalog name rather than guessing or corrupting Khmer text.
- SKU: PV-05766.
- Category: Gourmet Snacks.
- Food icon.
- Purchased: 10.
- Sold: 0.
- Current stock: 10.
- Daily velocity: 0.00/day.
- Coverage: No Sales (∞).
- Secondary coverage: Zero movement.
- Target policy: 60 Days.
- Target stock: 0.
- Excess: +10 Units.
- Secondary detail: Expiring in 45d.
- Risk: CRITICAL.
- Action: Flash Promo.

### Row 4
- Fast Charger 65W GaN Dual USB-C.
- SKU: PV-05182.
- Category: Power & Cables.
- Lightning icon.
- Purchased: 200.
- Sold: 160.
- Current stock: 80.
- Daily velocity: 4.20/day.
- Coverage: 19.0 Days.
- Secondary coverage: Healthy buffer.
- Target policy: 60 Days.
- Target stock: 80.
- Excess: 0 Units.
- Risk: HEALTHY.
- Action: Reorder PO.

### Row 5
- Cable Cat6 Shielded RJ45 10m.
- SKU: PV-00459.
- Category: Networking.
- Cable/connectivity icon.
- Purchased: 150.
- Sold: 110.
- Current stock: 55.
- Daily velocity: 3.10/day.
- Coverage: 17.7 Days.
- Secondary coverage: Fast turnover.
- Target policy: 60 Days.
- Target stock: 60.
- Excess: 0 Units.
- Risk: HEALTHY.
- Action: Monitor.

## 7. Calculation rules and consistency

Inspect and preserve the existing backend policy. Document the actual definitions before changing calculations.

Typical calculations, where applicable:

- Daily velocity = eligible sold units / observation days.
- Coverage days = applicable current stock / daily velocity.
- Target stock = daily velocity × target coverage days, adjusted by existing rounding, safety-stock, minimum-stock, and pack-size rules.
- Excess stock = max(current stock − target stock, 0).
- Tied capital = excess stock × applicable unit cost.

Use unrounded values in intermediate calculations and round only for display or according to existing quantity rules.

Important screenshot inconsistencies:
- Some reference velocities do not match sold quantities divided by the displayed date range.
- Some target stock values do not match a simple 60-day policy.
- Listed tied-capital amounts do not fully explain the total card.

Match the visual structure while ensuring real values follow one consistent, documented policy. Do not reproduce incorrect arithmetic.

Additional rules:
- Current inventory may include opening stock, transfers, returns, adjustments, and reservations. Use the established stock source.
- Define whether coverage uses on-hand, available, or inventory-position quantities.
- Use consistent units, currencies, and valuation methods.
- Distinguish missing sales history from confirmed zero sales.
- Newly introduced or recently received products should follow existing minimum-history rules before being called dead stock.
- An item with no stock should not automatically become a critical dead-stock item.
- Derive expiry warnings from actual batch/lot expiry data.
- If using the screenshot’s >500-day critical threshold, prefer existing configuration and handle boundaries consistently.
- Keep critical/high/healthy categories mutually exclusive.
- Aggregate totals across the complete filtered dataset, not only the visible page.

## 8. Suggested action behavior

Connect each action to the existing workflow:

- Create Clearance: open promotion/clearance setup with the product preselected.
- Hold POs: open the relevant purchasing review or hold workflow.
- Flash Promo: open promotion setup with the product preselected.
- Reorder PO: open purchase-order creation or reorder recommendations.
- Monitor: use existing product/report detail or monitoring behavior.

Do not immediately change prices, stop purchase orders, or create purchase orders merely by clicking a report suggestion.

Only suggest Reorder PO when actual reorder policy supports it. Being healthy or having less than 60 days of coverage alone does not prove a reorder is needed.

If an action is unsupported, show a clear unavailable state or route to an existing useful detail view. Do not create fake successful actions.

## 9. Table footer

Inside the table container:

- Left: Showing 1 to 5 of 5 tracked SKUs.
- Right: previous arrow, selected teal page 1, next arrow.
- Disable arrows when there is only one page.
- Update ranges and totals from actual pagination.
- Preserve server-side pagination where used.

## 10. Loading, errors, and accessibility

- Loading skeletons should preserve card and table dimensions.
- Provide empty states for no inventory, no sales history, and no search matches.
- Show retryable errors without presenting unavailable metrics as zero.
- Prevent stale requests from overwriting newer filter results.
- Preserve keyboard accessibility, focus states, tooltips, and descriptive button labels.
- Make filters and tabs usable on smaller screens without clipping content.

## 11. Completion checks

Compare the result against the screenshot and verify:

- All five filter/action controls.
- All five statistic cards and their badges/supporting text.
- All four risk tabs and search.
- All ten table columns.
- Product icons, SKU/category details, coverage subtitles, target quantities, excess-capital details, risk badges, and row actions.
- Footer result range and pagination.
- Correct calculations, zero-sales handling, risk classification, and aggregate consistency.
- Existing permissions and action workflows remain functional.

Run appropriate lint/type checks and relevant existing tests. Complete the implementation and report changed files, validation results, and any missing backend fields or integrations.