Enhance my existing **MarketChain ERP Business Dashboard** to match the attached screenshot.

First read the existing design system Markdown, frontend/backend rules, API conventions, and applicable project instructions. Inspect the current dashboard, reporting endpoints, sales targets, expenses, inventory alerts, purchasing intelligence, and order data before implementing changes.

Reuse existing components, chart libraries, services, permissions, query caching, currency utilities, and design tokens.

## 1. Scope and overall layout

Implement the dashboard content shown in the screenshot, including every section listed below.

Preserve:
- Existing sidebar groups and navigation.
- Top-left logo, platform name, and version.
- Shared header controls and profile menu.
- Sidebar operational-status footer.
- Existing authorized routes and unrelated functionality.

Visual style:
- Pale gray-blue page background.
- White rounded cards with subtle borders/shadows.
- Dark navy headings and prominent financial values.
- Teal primary actions and positive states.
- Amber warnings and red losses/shortfalls.
- Consistent spacing, icon sizes, typography, and padding.
- Support Khmer and English text.
- Responsive layouts without clipped labels, overflowing numbers, or excessive empty space.

Use the screenshot as a composition reference, not a fixed-size canvas.

## 2. Dashboard header and filters

Include:
- Title: Business Dashboard.
- Compact status badge: Live Feed Active.
- Description:
  “Your business performance, profitability, and operational health at a glance.”
- Branch/location selector:
  “All Branches (9 Locations)” in the reference.
- Date selector:
  “Today” in the reference.
- Comparison selector:
  “Compare: vs Yesterday”.
- Teal Refresh button with refresh icon.

Behavior:
- Populate branch options from authorized locations.
- Apply branch and reporting-period filters consistently.
- Use the configured business timezone.
- Compare equivalent periods; for an incomplete day, make the comparison basis clear.
- Refresh updates dashboard queries and shows progress.
- Display Live Feed Active only when a real subscription/polling mechanism supports that claim.
- Otherwise show an accurate state such as Last updated, Updating, or Connection interrupted.
- Reuse existing refresh behavior rather than introducing unnecessary constant polling.

## 3. Business health summary banner

Create a full-width white banner containing:
- Amber warning icon inside a pale amber square.
- Heading: How Is Your Business Doing?
- Status badge: Needs Attention.
- Supporting business-health description.
- Three compact metrics:
  - Gross Margin: 52.1%.
  - Expense Coverage: 78.1%.
  - Sales Goal: 45%.
- Subtle vertical separators between metrics.
- Right-side action: View Business Health →.

Use actual metrics and a documented existing health policy. Status may be healthy, needs attention, or another supported state.

Provide concise explanations/tooltips for the metrics and health status.

Connect View Business Health to an existing relevant report or an in-page detail drawer. Do not create a dead link.

## 4. Four primary KPI cards

### Gross Sales
- Heading: GROSS SALES.
- Main value: $2,250.00.
- Small teal sparkline.
- Positive comparison badge: ↑ +3,554.97%.
- Supporting text:
  “vs previous period ($61.56)”.

### Gross Profit
- Heading: GROSS PROFIT.
- Main value: $1,172.00.
- Small teal sparkline.
- Positive comparison badge: ↑ +6,974.31%.
- Inline/supporting label: Margin: 52.1%.

### Total Orders
- Heading: TOTAL ORDERS.
- Main value: 1.
- Inline secondary text: / 14 units.
- Small blue sparkline.
- Red comparison badge: ↓ -50.00%.
- Supporting text: vs previous period (2).

### Operating Result
- Heading: OPERATING RESULT.
- Main value: -$328.00 in red.
- Small pale red Shortfall badge.
- Description: After recorded operating expenses.
- Supporting text: vs $1,500 opex.

Requirements:
- Equal-height cards with aligned labels, values, and supporting content.
- Keep sparklines inside their cards; do not copy the screenshot’s overflow artifacts.
- Use actual trend data.
- Handle increases, decreases, no change, and zero comparison baselines.
- Do not display infinite or fabricated growth percentages.
- Use actual order and unit counts.

## 5. Revenue vs Cost vs Gross Profit chart

Main chart card:
- Title: Revenue vs Cost vs Gross Profit.
- Description:
  “Understand how sales and product costs affect your profit.”
- Legend:
  - Revenue: blue.
  - Product Cost: teal.
  - Gross Profit: amber.
- Multi-series line/area chart with subtle fills.
- Currency-formatted Y-axis.
- Time/date-formatted X-axis appropriate to the selected period.
- Subtle gridlines.
- Hover tooltip showing timestamp and all three values.
- Highlight selected/hovered points.
- Responsive chart dimensions.

Use the existing chart library. Avoid visual smoothing that materially misrepresents the data.

Define whether the chart displays interval totals or cumulative totals:
- Cumulative revenue should not decline unless legitimate refunds/adjustments justify it.
- Interval values may rise and fall.
- State the aggregation clearly.
- Do not plot future values as observed results.

Revenue and product cost must use the same period and accounting basis. Gross profit should reconcile with those series.

At the bottom, include a pale mint Executive Insight panel:
- Sparkle/insight icon.
- Bold prefix: Executive Insight:
- Reference:
  “Gross profit increased this week, mainly driven by higher sales of your top three products.”
- Action: View Sales Report →.

Generate insight text from verified metrics or existing insight services. Do not invent causal explanations or introduce an LLM dependency merely for this text.

Avoid unnecessary blank space between the chart and insight panel.

## 6. Sales Goal card

Place beside the chart on desktop.

Include:
- Title: Sales Goal.
- Description: Are you on track to reach your target?
- Amber Behind Target badge.
- Large progress: 45%.
- Period label: Month to Date.
- Teal progress bar on a pale blue track.
- Detail rows:
  - Monthly Target: $10,000.00.
  - Sales So Far: $4,500.00.
  - Still Needed: $5,500.00.
- Footer action: Manage Sales Target →.

Connect to the existing SalesTarget feature.

Use the configured target type and period. If the global filter is Today but this card is Month to Date, clearly preserve that separate scope rather than mixing values silently.

Determine Behind Target from target pacing and elapsed business/calendar days according to existing policy. Being below 100% mid-month alone does not mean the business is behind.

For missing targets, display a helpful Set Sales Target state.

Clamp only the visual progress bar where needed; allow the numeric result to show achievement above 100%.

## 7. Expense coverage card

Below Sales Goal on desktop.

Include:
- Title: Can Your Business Cover Its Expenses?
- Description:
  “Compare gross profit with operating expenses.”
- Gross Profit label, teal dot, value $1,172.00, and teal comparison bar.
- Operating Expenses label, neutral dot, value $1,500.00, and neutral comparison bar.
- Pale red summary strip:
  - 78.1% of expenses covered.
  - Shortfall: $328.00.
- Explanation:
  “Your gross profit is $328 below your recorded operating expenses for this period.”
- Footer action: View Financial Report →.

Use one common scale for both comparison bars.

Formulas, where consistent with existing accounting rules:
- Expense coverage = gross profit / operating expenses × 100.
- Operating result = gross profit − applicable operating expenses.
- Shortfall = max(operating expenses − gross profit, 0).

Handle zero expenses and missing expense records explicitly. Do not imply strong profitability merely because expenses have not been recorded.

Change styling and text appropriately for a surplus.

## 8. What Needs Your Attention section

Full-width white card containing:
- Alert/bell icon.
- Heading: What Needs Your Attention?
- Subtitle: Important things you may want to review.
- Top-right action: View All Insights (7) →.
- Divider.
- Four insight cards on desktop, wrapping responsively.

### Low stock
- HIGH PRIORITY badge.
- Inventory icon.
- Title: 3 products may run out soon.
- Description identifying products below configured reorder levels.
- Reference products: XS Max Board, IRVINS Salmon Skin.
- Action: Review Inventory →.
- Pale red border/background treatment.

### Expense shortfall
- HIGH PRIORITY badge.
- Finance/wallet icon.
- Title: Operating expenses are not fully covered.
- Description using actual gross profit, expenses, and shortfall.
- Action: View Financial Report →.
- Pale red treatment.

### Purchase cost increase
- MEDIUM badge.
- Purchase/cost icon.
- Title: Milk purchase cost increased by 12%.
- Description explaining verified purchase-cost variance and affected margins.
- Action: Review Purchase Prices →.
- Pale amber treatment.

### Sales target pacing
- MEDIUM badge.
- Target icon.
- Title: Sales are behind your monthly target.
- Description comparing sales achievement with elapsed-period pacing.
- Action: View Sales Goal →.
- Pale amber treatment.

Requirements:
- Use actual alert data and counts.
- Do not show the milk example unless it exists in the business data.
- Prioritize using established severity rules.
- Avoid duplicated alerts for the same underlying issue.
- Keep card actions aligned at the bottom.
- View All Insights shows the full available list through an existing page or drawer.
- Show a calm all-clear state when no actionable insights exist.
- Recommendations navigate to review workflows; they must not mutate prices, inventory, or orders automatically.

## 9. Top Moving Products table

Bottom-left card on desktop.

Header:
- Lightning icon.
- Title: Top Moving Products (Today), adapting to the selected period.
- Right action: View Full Catalog →.
- Divider.

Table columns:
1. PRODUCT DETAILS.
2. UNITS SOLD.
3. UNIT PRICE.
4. GROSS REVENUE.

Each product cell:
- Product icon/image inside a pale blue rounded square.
- Bold name.
- Smaller SKU and category.

Reference rows:
1. XS Max Logic Board Unlocked.
   - SKU: MB-XSM-256G.
   - Electronics.
   - 5 pcs.
   - $260.00.
   - $1,300.00.

2. 12 Pro Max Motherboard OEM.
   - SKU: MB-12PM-512G.
   - Parts.
   - 3 pcs.
   - $250.00.
   - $750.00.

3. IRVINS Salted Egg Salmon Skin.
   - SKU: FMCG-IRV-105.
   - FMCG Retail.
   - 12 bags.
   - $16.67.
   - $200.00.

Bottom tinted summary strip:
- “3 active product lines generated 100% of today’s sales.”
- Right: Total: $2,250.00.

Use real top products and a clearly defined ranking metric. Do not sum incompatible quantity units to rank products without an established normalization rule.

If sale prices vary, display an accurately labeled average selling price rather than implying a fixed unit price. Calculate revenue from transactions, not rounded displayed prices.

Compute the share against total eligible sales. Adapt the footer when top products represent less than 100%.

## 10. Sales Channel Distribution

Bottom-right upper card.

Include:
- Title: Sales Channel Distribution.
- Top-right freshness label: Real-time, only if accurate.
- Horizontal stacked distribution bar:
  - POS Terminal: teal.
  - Online / Chat: blue.
  - Wholesale: amber.
- Three detail tiles:
  - POS Terminal: 65%, $1,462.50.
  - Online / Chat: 25%, $562.50.
  - Wholesale: 10%, $225.00.

Derive channels from actual order source data.
- Use revenue share if showing amounts and percentages as in the screenshot.
- Label the basis clearly.
- Reconcile channel totals with the matching sales metric and scope.
- Handle additional/unknown channels without silently excluding them.
- Handle zero sales without invalid percentages.
- Keep colors consistent across the bar and legend tiles.

## 11. Recent Transactions Stream

Bottom-right lower card.

Include:
- Subtle status dot.
- Title: Recent Transactions Stream.
- Top-right label: Latest 3.
- Three stacked pale blue transaction cards.

Each card:
- Circular transaction-type initials, such as SO.
- Order reference.
- Customer/source description.
- Timestamp.
- Right-aligned amount.
- Compact status badge, such as Completed.

Reference examples:
1. SO-2024-00892.
   - Sophanna Tech Store.
   - 10:42 AM.
   - $2,250.00.
   - Completed.

2. SO-2024-00891.
   - K Mall Walk-in.
   - Yesterday, 04:15 PM.
   - $32.50.
   - Completed.

3. SO-2024-00890.
   - Retail Client (QR Pay).
   - Yesterday, 02:00 PM.
   - $29.06.
   - Completed.

Use real order references, customer details, timestamps, and lifecycle states.
- Do not equate payment method with transaction completion.
- Clicking a transaction opens its authorized details.
- Follow global filters, or clearly label any independent latest-activity scope.
- Preserve readable layout for long names and references.

## 12. Metric definitions and screenshot inconsistencies

The screenshot is a visual reference, not authoritative business data.

Ensure:
- Gross sales, net sales, revenue, COGS, gross profit, and operating result use clear existing definitions.
- Discounts, refunds, returns, taxes, and delivery charges follow the current reporting policy.
- Gross profit reconciles with eligible revenue minus COGS.
- Gross margin uses the same revenue basis.
- Inventory purchase spend is not treated as COGS automatically.
- Operating result is not called net profit unless all required expense categories are included.
- Currency conversion and rounding use existing utilities.
- Aggregates come from the complete authorized dataset, not the visible table rows.

Correct reference inconsistencies:
- The product table’s units do not match the KPI’s 14-unit example.
- Rounded unit prices may not multiply exactly to displayed revenue.
- Different time scopes, such as Today and Month to Date, must remain explicitly labeled.
- Decorative chart values and growth percentages must be replaced with calculated results.

Use reference values only in development fixtures for visual comparison.

## 13. Integration and performance

- Reuse existing dashboard/report endpoints and query keys.
- Extend existing backend reporting services only where required.
- Prefer efficient aggregate queries rather than loading transaction history into the browser.
- Preserve tenant, location, role, and workspace authorization.
- Hide restricted financial metrics and actions according to existing permissions.
- Keep independent widgets resilient: one failed request should not blank the whole dashboard.
- Prevent stale responses after filter changes.
- Preserve the current dashboard’s useful features that are outside the screenshot unless they conflict with this requested layout.

Provide:
- Loading skeletons.
- Widget-level error and retry states.
- Empty states for new businesses.
- Accurate unavailable-data indicators.
- Last-updated information.
- Useful setup actions for missing targets or unrecorded expenses.

Do not fabricate production data, live connections, alerts, or insight conclusions.

## 14. Verification and completion

Compare the implementation against the screenshot section by section:
- Header, live/freshness state, branch/date/comparison filters, Refresh.
- Business health banner and three metrics.
- All four KPI cards and sparklines.
- Three-series financial chart and Executive Insight panel.
- Sales Goal and expense coverage cards.
- All attention cards and links.
- Top Moving Products table and summary strip.
- Sales Channel Distribution.
- Recent Transactions Stream.

Verify desktop, tablet, and mobile layouts; chart resizing; Khmer rendering; filters; calculations; links; permission handling; loading; empty; and error states.

Run appropriate lint/type checks and relevant existing tests. Complete the implementation and report changed files, verification results, and any missing backend data or integrations.