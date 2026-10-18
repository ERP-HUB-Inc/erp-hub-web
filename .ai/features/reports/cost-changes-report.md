Implement or enhance my existing **Purchase Price Increase / Purchase Cost Variance report** to match the attached screenshot.

First read the existing design system Markdown, frontend/backend rules, API conventions, and relevant project instructions. Inspect the existing purchasing intelligence report and reuse its APIs, components, formatting utilities, permissions, and query patterns.

Implement this within the existing application. Preserve surrounding navigation and unrelated reports.

## 1. Overall design

- Pale gray-blue page background.
- White rounded filter toolbar, statistic cards, and table container.
- Subtle borders and shadows.
- Dark navy primary text, muted secondary text.
- Red for cost increases and margin pressure.
- Teal for cost decreases, savings, and positive indicators.
- Match the screenshot’s spacing, proportions, typography, icons, badges, and alignment using existing design tokens.
- Four equal-height statistic cards on desktop; two columns on tablet and one on mobile.
- Keep the table horizontally scrollable on smaller screens.

## 2. Top filter toolbar

Include these controls in order:

1. Date-range picker with calendar icon.
   - Reference: 18/10/2026 ~ 18/10/2026.
2. Store/location multi-select with warehouse icon.
   - Reference: All Stores (Toul Kork, BKK, Sen Sok).
3. Supplier selector with supplier/handshake icon.
   - Reference: All Suppliers.
4. Minimum variance selector with percentage icon.
   - Reference: Min Variance: ≥ 5.0%.
5. Right-aligned comparison reference.
   - Reference: Ref: Oct 18 vs Oct 17.
6. Recalculate button with refresh/recalculate icon.

Use actual selected dates and locations rather than hardcoded screenshot values.

Inspect the existing comparison policy and make the reference label accurately explain the baseline. Do not silently assume previous day, previous purchase, and previous period are equivalent.

Recalculate must refresh the report using the active filters, show a loading state, and prevent duplicate requests. Respect tenant, branch, location, and permission scopes.

## 3. Price Hike Alert banner

Reproduce the pale red bordered banner containing:

- Red alert/price-impact icon.
- Reference message:
  “Price Hike Alert: 1 key product (11 Pro Max Board) rose +40.0% ($5.00 → $7.00). Current gross margin squeezed to 12.5%.”
- Emphasize the alert title, percentage increase, and current margin in red.
- Highlight the product name in teal.
- Right-side teal Update Retail Price button.
- Dismiss action.

Behavior:
- Populate the message from actual qualifying products.
- Handle multiple affected products with a concise summary.
- Hide the alert when no qualifying price increase exists.
- Update Retail Price must open the existing authorized pricing workflow for the affected product. Do not directly change prices on click.
- Dismiss should follow the existing application convention and reset appropriately when the alert’s underlying data changes.
- Do not invent a selling price or margin when pricing data is unavailable.

## 4. Four statistic cards

### Affected SKUs
- Heading: AFFECTED SKUS.
- Top-right grid/SKU icon.
- Main value: 1.
- Supporting text: 3.1% of monitored items.

### Cost Increased
- Heading: COST INCREASED in red.
- Top-right upward-trend icon in red.
- Main value: 1 in dark red.
- Right-side pale red badge: +40.0% Max.
- Supporting text: +$100.00 daily exposure.

### Cost Decreased
- Heading: COST DECREASED.
- Top-right downward-trend icon.
- Main value: 0.
- Supporting text: $0.00 direct savings.

### Stable / Unchanged
- Heading: STABLE / UNCHANGED.
- Top-right outlined check-circle icon.
- Main value: 31.
- Right-side mint badge: 96.9% stable.
- Supporting text: Within target band (±5%).

Use actual metrics. Match the visual structure without hardcoding these numbers.

Define categories consistently:
- Increased: positive variance meeting the selected threshold.
- Decreased: negative variance meeting the selected threshold in magnitude.
- Stable: variance within the threshold band.
- Affected: increased plus decreased.
- Exclude or separately identify products without a valid comparison baseline.
- Clarify exact boundary handling so the categories do not overlap.

Calculate maximum increase from eligible increased products.

Only label exposure as “daily” when it is based on an actual daily quantity or forecast. Batch cost impact must be labeled as batch exposure. Apply the same clarity to savings.

## 5. Table toolbar and tabs

Inside the white table container, include:

- All Affected SKUs (1) — selected in the reference, with pale mint fill and teal border/text.
- Cost Increased (1) — with red dot.
- Cost Decreased (0).
- Stable SKUs (31).
- Right-aligned search field with search icon:
  “Filter by product, SKU…”

Tabs must filter actual rows and show accurate counts for the current report filters. Search should match product names and SKUs using existing server/client filtering conventions.

Reset pagination appropriately when filters, search, or tabs change.

IMPORTANT: The screenshot mixes increased, decreased, and stable example rows under “All Affected SKUs (1)”. Reproduce the visual design, but correct the data behavior:
- All Affected shows increased and decreased rows only.
- Increased shows increased rows.
- Decreased shows decreased rows.
- Stable shows stable rows.
- Counts, footer, and visible rows must agree.

## 6. Table columns

Preserve this order:

1. PRODUCT & SKU
2. BATCH INBOUND QTY
3. PREVIOUS COST
4. CURRENT COST
5. VARIANCE ($ & %)
6. GROSS MARGIN IMPACT

Use a lightly tinted uppercase header, subtle horizontal row dividers, and consistent row padding.

Align product information left and financial values right. Keep quantity alignment consistent.

### Product & SKU cell
- Tinted rounded icon square.
- Bold product name.
- Small status badge beside the name:
  - Hike in red.
  - Discount in teal, matching the reference; use “Cost Decreased” instead if needed to avoid implying a sales promotion.
  - Stable in muted blue-gray.
- Secondary line: SKU and supplier separated by a dot.
- Allow long names and supplier text without overlap.

### Batch Inbound Qty cell
- Current inbound quantity and unit.
- Muted previous quantity in parentheses.

### Previous Cost cell
- Formatted previous unit cost in muted text.

### Current Cost cell
- Red for increased cost.
- Teal for decreased cost.
- Dark neutral for stable cost.

### Variance cell
- Signed currency difference on the first line.
- Signed percentage and short descriptor beneath:
  - +40.0% hike.
  - -10.4% save.
  - 0.0%.
- Use text and signs as well as color.

### Gross Margin Impact cell
- Current margin, emphasized according to impact.
- Previous margin in muted parentheses.
- Show “unchanged” where applicable.
- Display “—” with an explanation when margin cannot be calculated.

## 7. Reference rows for visual fixtures

Use these only in development fixtures, not as production data.

### Increased
- Product: 11 Pro Max Board.
- Badge: Hike.
- SKU: PV-04603.
- Supplier: Foxconn Tech.
- Current inbound: 50 pcs.
- Previous inbound: 100 pcs.
- Previous cost: $5.00.
- Current cost: $7.00.
- Variance: +$2.00 / +40.0% hike.
- Current margin: 12.5%.
- Previous margin: 37.5%.
- Red processor/chip icon tile.

### Decreased
- Product: OLED Display Digitizer 12.
- Badge: Discount.
- SKU: PV-08920.
- Supplier: Shenzhen Precision.
- Current inbound: 120 pcs.
- Previous inbound: 80 pcs.
- Previous cost: $24.00.
- Current cost: $21.50.
- Variance: -$2.50 / -10.4% save.
- Current margin: 43.4%.
- Previous margin: 36.8%.
- Teal phone/display icon tile.

### Stable
- Product: XS Max Logic Board Unlocked.
- Badge: Stable.
- SKU: PV-03112.
- Supplier: Foxconn Tech.
- Current inbound: 40 pcs.
- Previous inbound: 40 pcs.
- Previous cost: $12.00.
- Current cost: $12.00.
- Variance: $0.00 / 0.0%.
- Margin: 38.4% (unchanged).
- Neutral grid/component icon tile.

Keep fixture totals and tab counts internally consistent, even if that requires different counts from the screenshot.

## 8. Footer and pagination

Below the table, include:

- Left information icon and explanatory text:
  “Weighted Cost = Total Batch Spend ÷ Inbound Qty”
- Followed by the actual result summary:
  “Showing 1 of 1 variance flagged items (32 SKUs monitored)”
- Adapt the summary to the selected tab so stable results are not called variance-flagged items.
- Right-aligned pagination:
  - Page 1 of 1.
  - Previous arrow.
  - Selected page number.
  - Next arrow.
- Disable pagination controls when appropriate.
- Use server totals when pagination is server-side. Do not calculate overall statistics from only the visible page.

## 9. Calculation and data requirements

Reuse the backend’s established cost basis and report policy.

Where applicable:

- Weighted unit cost = eligible total batch spend / eligible inbound quantity.
- Cost difference = current unit cost − previous unit cost.
- Variance percentage = cost difference / previous unit cost × 100.
- Gross margin percentage = (selling price − unit cost) / selling price × 100.

Handle zero or missing previous cost without dividing by zero or displaying a misleading percentage.

Use the same comparable unit, currency, and cost basis for both periods. Follow existing rules for discounts, freight, tax, returns, canceled receipts, and landed cost. Do not invent a new accounting policy.

Use a consistent selling-price basis when comparing cost-driven margin changes. If the selling price also changed, disclose that comparison rather than attributing the entire margin change to purchase cost.

Calculate aggregates on the backend when existing architecture requires it. Do not fetch every purchase record into the browser merely to build the report.

## 10. States and integration

- Reuse existing query caching, API clients, currency formatting, and authorization.
- Provide dimension-preserving loading skeletons.
- Show a helpful empty state for no purchases, no baseline, or no matching results.
- Provide an error state with retry.
- Distinguish a confirmed zero from unavailable data.
- Protect against stale responses when filters change quickly.
- Refresh report values after a successful price update where relevant.
- If fields or endpoints are missing, report the precise dependency; do not fabricate production metrics.

## 11. Completion checks

Verify against the attached screenshot:

- All toolbar controls and comparison label.
- Complete alert banner and both actions.
- All four statistic cards, icons, badges, and supporting text.
- All four tabs and product/SKU search.
- All six table columns and every row detail.
- Weighted-cost explanation, result count, and pagination.
- Responsive layout, accessible labels, focus states, and readable contrast.
- Correct filtering, threshold boundaries, calculations, zero-baseline handling, and consistent totals.

Run appropriate lint/type checks and relevant existing tests. Complete the implementation and report changed files, verification results, and any missing integrations.