Implement or enhance my existing **Purchase vs Sales report** using both attached screenshots as the visual references:

1. Four summary cards.
2. Detailed product comparison table with inventory insights and actions.

First read the existing design system Markdown, project instructions, frontend/backend rules, and API conventions. Inspect the current Purchase vs Sales report and reuse existing components, endpoints, inventory valuation, permissions, and formatting utilities.

Complete this inside the existing application. Preserve existing page navigation, filters, exports, and unrelated functionality.

## 1. Shared appearance and layout

- Pale gray-blue page background.
- White cards and table container with rounded corners, subtle borders/shadows.
- Dark navy primary text and muted secondary labels.
- Teal for positive financial results and healthy inventory.
- Red for losses and negative margins.
- Amber for warnings and reorder/price-review indicators.
- Pale blue backgrounds for secondary controls and icon tiles.
- Match the screenshots’ spacing, typography, alignment, badges, icons, and visual hierarchy using existing design tokens.
- Four equal-height summary cards in a desktop row; two columns on tablet and one on mobile.
- Table scrolls horizontally on smaller screens.
- Support English and Khmer without clipping characters.

## 2. Summary cards

### Card 1: TOTAL SALES (MONEY IN)
- Heading: TOTAL SALES (MONEY IN).
- Large value: $31,531.65.
- Top-right money icon inside a pale mint rounded square.
- Bottom mint badge with shopping-bag icon: 390 items sold.
- Adjacent supporting text: Across 32 products.
- Thin teal/green bottom accent strip.

### Card 2: TOTAL COST (MONEY OUT)
- Heading: TOTAL COST (MONEY OUT).
- Large value: $17,562.50.
- Top-right delivery truck icon inside a pale blue rounded square.
- Bottom pale blue badge with storage icon: 758 items restocked.
- Adjacent supporting text: In this period.
- Thin pale blue bottom accent strip.

### Card 3: NET PROFIT (KEEP)
- Heading: NET PROFIT (KEEP).
- Large signed teal value: +$7,687.40.
- Top-right upward-trend icon inside a mint rounded square.
- Bottom mint badge: 32.2% Margin.
- Adjacent check-circle icon and text: Healthy profit earned.
- Thin mint bottom accent strip.
- Use red and appropriate wording for an actual loss.

### Card 4: STOCK ALERTS & HEALTH
- Heading: STOCK ALERTS & HEALTH.
- Subtitle: Quick product status.
- Top-right sliders/settings icon in a pale blue rounded square.
- Three equally sized status tiles:
  - Pale amber: 3 / Selling Fast.
  - Pale blue: 4 / Too Much Stock.
  - Pale mint: 1 / New Restock.
- Thin neutral bottom accent strip.
- If existing report filtering supports it, let each tile filter the corresponding product category and show its selected state. Otherwise keep it informational.

All values above are screenshot references only. Use actual data in production.

## 3. Financial terminology and consistency

Inspect the existing report definitions before changing calculations.

IMPORTANT: The screenshot’s sales, purchase cost, profit, and margin do not reconcile through simple subtraction. Preserve its visual layout, but do not reproduce inconsistent accounting.

Keep these concepts separate:
- Purchase spend: cost of eligible purchases/receipts during the period.
- Sales revenue: eligible net sales during the period.
- Cost of goods sold: inventory cost allocated to units actually sold.
- Gross profit: net sales revenue minus cost of goods sold.
- Net profit: gross profit minus applicable expenses and other adjustments, according to existing rules.

The summary’s “TOTAL COST” must clearly indicate whether it means purchase spend or cost of goods sold. Purchase spend must not automatically be deducted from revenue to calculate product profit.

Use “NET PROFIT” only when expenses required by the application’s net-profit definition are included. Otherwise label the metric “GROSS PROFIT”.

“Money In” and “Money Out” imply actual cash movements. If the report uses sales and purchase documents rather than collections/payments, use truthful labels or add a concise explanation.

Calculate the displayed margin from the same profit measure and revenue basis. Do not hardcode 32.2%.

Preserve the screenshot’s card structure while making metric labels accurate.

## 4. Detailed table

Columns in this exact order:

1. PRODUCT & SKU
2. UNITS (BOUGHT VS SOLD)
3. FINANCIAL FLOW
4. PROFIT & MARGIN
5. INVENTORY STATUS & NEXT STEP
6. ACTION

Use a pale blue uppercase table header, subtle horizontal row separators, generous row spacing, and aligned values.

### PRODUCT & SKU
- Product icon/image inside a pale blue rounded square.
- Bold product name.
- Preserve any Khmer/localized product name.
- Secondary line: SKU badge, separator dot, category.

### UNITS (BOUGHT VS SOLD)
- Bought quantity at the upper left.
- Sold quantity at the upper right.
- Compact horizontal comparison bar:
  - Blue segment represents bought units.
  - Teal segment represents sold units.
  - For this comparison design, normalize segment widths against bought + sold.
  - Show an empty/neutral bar if both are zero.
- Explanation beneath the bar, with an appropriate icon and status color.
- Net period movement = bought units − sold units.
- Positive movement must not automatically be described as available stock or safe reserve.

### FINANCIAL FLOW
Three vertically aligned rows:
- Purchased: amount.
- Sales Revenue: amount.
- Sales Cost: amount.

Use muted labels and aligned amounts.
- Positive revenue may use teal.
- Loss-driving costs may use red.
- Where actual lot-cost data supports it, the third label may read Old Batch Cost.
- Define Sales Cost as the cost of goods sold, with a tooltip or clearer label such as “Sales Cost (COGS)”.

### PROFIT & MARGIN
- Large signed profit/loss amount.
- Positive amounts in teal.
- Negative amounts in red.
- Neutral styling for break-even.
- Rounded secondary badge:
  - Percentage Margin.
  - Break-even.
  - Loss Detected.
  - Negative Margin.
  - Awaiting Sale.
- For no sales, show a dash and Awaiting Sale rather than a misleading margin percentage.

### INVENTORY STATUS & NEXT STEP
- Compact colored pill with relevant icon and/or dot.
- One concise explanatory sentence underneath.
- Derive status and recommendations from actual inventory, sales velocity, cost, and restock history.

### ACTION
- Compact icon-and-text button.
- Reuse existing routes, dialogs, permissions, and workflows.

## 5. Reference rows

Use these as development fixtures for visual comparison only. Production values must be calculated consistently from real data.

### Row 1: iPhone 11 Pro Max Air 20222
- Preserve the real catalog name; do not introduce the screenshot’s possible naming typo into production.
- SKU: PV-02009.
- Category: Smartphones.
- Phone icon.
- Bought: 13.
- Sold: 27.
- Movement: -14 Net (Sold from prior stock).
- Purchased: $5,800.00.
- Sales Revenue: $13,500.00.
- Sales Cost: $8,021.88.
- Profit reference: +$5,478.13.
- Margin: 40.6%.
- Status: High Demand · Reorder Soon.
- Explanation: Selling 2× faster than restocks. Replenish immediately.
- Teal action: Restock PO, with cart icon.

The reference profit contains a rounding discrepancy relative to the displayed revenue and cost. Calculate the actual result using the project’s money rules.

### Row 2: Lenovo ThinkCentre M70T
- SKU: PV-04609.
- Category: Desktops & Workstations.
- Monitor icon.
- Bought: 15.
- Sold: 5.
- Reference movement text: +10 in safe reserve.
- Purchased: $7,500.00.
- Sales Revenue: $2,500.00.
- Sales Cost: $2,500.00.
- Profit: $0.00.
- Badge: Break-even.
- Status: In Stock · 10 Available.
- Explanation: Buffer is healthy. No replenishment required today.
- Action: View Stock, with eye icon.

Only show “10 Available” or “safe reserve” when actual stock and policy confirm it. Period movement alone does not establish either.

### Row 3: XS Max Board
- SKU: SKU-0001.
- Category: Internal Components.
- Processor icon.
- Bought: 45.
- Sold: 35.
- Reference movement text: +10 in reserve.
- Purchased: $567.50.
- Sales Revenue: $280.00.
- Sales Cost: $1,042.83.
- Profit: -$762.83.
- Badge: Loss Detected.
- Status: Needs Price Review.
- Explanation: Current retail is below inventory unit cost. Mark up price.
- Action: Adjust Price, with pencil icon.

Only claim the current retail price is below cost when current price/cost data verifies it. Historical realized losses alone do not establish the current price condition.

### Row 4: IRVINS Salted Egg 105g
- Preserve the existing Khmer name alongside the English name.
- SKU: PV-08001.
- Category: Packaged Snacks.
- Food icon.
- Bought: 10.
- Sold: 12.
- Movement text: -2 Sold from previous batch.
- Purchased: $100.00.
- Sales Revenue: $168.00.
- Sales Cost: $87.26.
- Profit: +$80.74.
- Margin: 48.1%.
- Status: Healthy Fast Turnover.
- Explanation: Top-tier velocity with solid 48.1% profitability.
- Action: View Item, with eye icon.

### Row 5: 11 Pro Max Board
- SKU: PV-04603.
- Category: Internal Components.
- Board/component icon.
- Bought: 5.
- Sold: 8.
- Movement text: -3 Units sold from old stock.
- Purchased: $25.00.
- Sales Revenue: $64.00.
- Old Batch Cost: $2,250.00.
- Profit: -$2,186.00.
- Badge: Negative Margin.
- Status: Negative Margin Alert.
- Explanation: Loss driven by legacy high-cost lot. Audit FIFO batch.
- Pale red action: Inspect Cost, with inspection icon.

Only mention legacy lots or FIFO when supported by actual cost allocations and the application’s valuation method. Do not assume FIFO if the system uses weighted-average costing.

### Row 6: Samsung Galaxy A54 5G Armor Case
- SKU: PV-01042.
- Category: Accessories.
- Accessories/product icon.
- Bought: 100.
- Sold: 0.
- Movement text: +100 New shelf stock.
- Purchased: $3,000.00.
- Sales Revenue: $0.00.
- Sales Cost: $0.00.
- Profit display: —.
- Badge: Awaiting Sale.
- Status: New Batch · On Display.
- Explanation: 100 units stocked. Place on front retail shelves.
- Action: Promote, with megaphone icon.

Only label a product as a new batch or on display when the relevant receipt/display data supports that label.

## 6. Inventory and recommendation rules

- Bought and sold must use clearly defined eligible transactions within the selected period.
- Apply existing treatment of returns, cancellations, refunds, transfers, and unit conversions.
- Current stock comes from the stock ledger, not bought minus sold.
- Sold exceeding bought can indicate sales from opening stock, but claims about particular batches require actual allocation data.
- Reorder recommendations must consider available stock, coverage, lead time, safety stock, and open purchase orders where supported.
- Overstock recommendations must use the existing overstock policy.
- A product may have multiple issues. Define a consistent priority for the primary status and action, while keeping supporting details available.
- Avoid unsupported claims such as “healthy,” “urgent,” or “selling twice as fast” without sufficient data.
- Use actual cost allocations for product profitability.
- Reuse existing currency conversion and precision rules.
- Calculate totals across the complete filtered dataset rather than only the current page.

## 7. Action behavior

- Restock PO: open purchase-order creation or reorder flow with product preselected.
- View Stock: open stock detail for the product and active location scope.
- Adjust Price: open the authorized price-edit workflow.
- View Item: open product details.
- Inspect Cost: open inventory valuation, cost breakdown, or batch allocation details.
- Promote: open existing promotion setup with the product preselected.

Actions must navigate to a reviewable workflow. Do not create purchase orders, change prices, or publish promotions immediately from a report click.

Hide or disable actions according to existing permissions. If an integration is missing, provide a truthful unavailable state and report the missing dependency.

## 8. Footer and pagination

Reproduce:

- Left:
  “Showing 1 to 6 of 32 products”
- Vertical separator.
- Rows per page selector, reference value: 10.
- Right:
  - First-page control.
  - Previous-page control.
  - Page numbers 1, 2, 3, 4.
  - Next-page control.
  - Last-page control.
- Selected page uses a solid teal rounded background.

Use actual ranges and totals. The screenshot shows only six reference rows despite a page size of ten; do not intentionally omit available rows to recreate that mismatch.

Preserve server-side pagination where used. Reset page appropriately when existing filters or search change.

## 9. Data integration and states

- Preserve and connect existing date, location, supplier, category, and search filters, even though they are outside these screenshot crops.
- Reuse existing query caching and API services.
- If the existing report lacks required metrics, extend the appropriate backend report service and contract following project conventions.
- Do not fetch the complete transaction history into the browser to calculate the report.
- Do not fabricate production metrics or success states.
- Provide loading skeletons, empty results, unavailable-data indicators, and retryable errors.
- Distinguish confirmed zero values from missing data.
- Prevent stale filter requests from replacing newer results.
- Refresh relevant report data after completed price, purchase, or promotion workflows.

## 10. Verification and completion

Compare against both screenshots and verify:

- All four summary cards, icon tiles, supporting badges, status tiles, and bottom accent strips.
- All six table columns.
- Every row’s icon, product name, SKU/category, bought/sold labels, comparison bar, movement note, financial rows, profit badge, inventory insight, and action.
- Complete footer and pagination.
- Responsive layout, Khmer rendering, keyboard accessibility, and contrast.
- Correct financial calculations, stock interpretation, aggregate totals, and permission behavior.

Run appropriate lint/type checks and relevant existing tests. Complete the implementation and report changed files, checks performed, and any missing data integrations.