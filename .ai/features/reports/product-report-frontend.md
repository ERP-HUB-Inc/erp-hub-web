# Product Report Frontend Integration Requirements

## 1. Purpose

Build the Product Report frontend as a business-oriented inventory and pricing dashboard.

The frontend should help a business owner quickly understand:

1. How much inventory they have.
2. How much money is tied up in inventory.
3. Which products have healthy or unhealthy margins.
4. Which products are low/out of stock.
5. Which products need attention.
6. What action should be reviewed next.

The UI should be simple, fast, and easy to scan.

Do not expose unnecessary technical/database details to the business user.

---

# 2. API

Use the backend Product Report API:

```http
GET /api/inventory/reports/stock
```

Reuse the project's existing API client, response wrapper, error handling, authentication, and request conventions.

Do not create a second API client pattern only for this page.

---

# 3. Query Parameters

The frontend should support:

```text
keyword
locationId
categoryId
brandId
status
page
limit
sortBy
sortOrder
```

Example:

```http
GET /api/inventory/reports/stock?keyword=coca&locationId=1&categoryId=2&page=1&limit=20
```

Only send filters that have values.

Do not send unnecessary empty parameters unless the existing API client convention requires them.

---

# 4. Expected Response

Conceptually, the API returns:

```json
{
  "summary": {
    "totalProducts": 120,
    "inventoryCost": 15000.00,
    "salesValue": 21000.00,
    "expectedProfit": 6000.00,
    "lowStock": 12,
    "pricingIssues": 8
  },
  "items": [
    {
      "id": 1001,
      "itemName": "Coca Cola 330ml",
      "sku": "CC330",
      "barcode": "123456789",
      "unitCost": 0.45,
      "salesPrice": 0.75,
      "marketPrice": 0.82,
      "marginPercent": 40,
      "upcomingQty": 100,
      "quantityOnHand": 250,
      "totalCost": 112.50,
      "totalSalesValue": 187.50,
      "expectedProfit": 75.00,
      "expectedLoss": 0,
      "inventoryStatus": "HEALTHY",
      "pricingStatus": "BELOW_TARGET_MARGIN"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

The actual backend response wrapper takes precedence.

If the backend uses different property names, map them through the existing DTO/API type instead of spreading API-specific differences throughout components.

---

# 5. Page Layout

Recommended page:

```text
Product Report

[Summary Cards]

[Search] [Location] [Category] [Brand] [Status]

[All] [Needs Attention] [Low Stock] [Pricing] [Profitable] [Loss]

[Product Report Table]
```

The page should follow the existing application's layout, spacing, typography, table, filter, and responsive conventions.

Do not introduce a new design system.

---

# 6. Summary Cards

Display these summary cards above the table:

```text
Total Products
Inventory Cost
Sales Value
Expected Profit
Low Stock
Pricing Issues
```

Example:

```text
Total Products
120

Inventory Cost
$15,000.00

Sales Value
$21,000.00

Expected Profit
$6,000.00

Low Stock
12

Pricing Issues
8
```

## Requirements

- Summary values come from `response.summary`.
- Do not calculate summary totals from the current page.
- Format money using the project's existing currency/number formatter.
- Format quantities using the project's existing number formatter.
- Handle loading state.
- Handle empty/zero values correctly.
- Do not display `undefined`, `NaN`, or raw API values.

---

# 7. Main Table

The default table should prioritize readability.

Recommended columns:

| Column | API Field |
|---|---|
| Item | `itemName` |
| SKU | `sku` |
| Cost | `unitCost` |
| Price | `salesPrice` |
| Market | `marketPrice` |
| Margin | `marginPercent` |
| Stock | `quantityOnHand` |
| Action | derived/UI |

The following fields should remain available in the detail drawer:

```text
Barcode
Upcoming Qty
Total Cost
Total Sales Value
Expected Profit
Expected Loss
Inventory Status
Pricing Status
```

Do not make the table excessively wide by displaying every backend field by default.

---

# 8. Table Column Details

## Item

Display:

```text
itemName
```

If appropriate according to the existing UI conventions, make the item clickable to open the product detail/insight drawer.

---

## SKU

Display:

```text
sku
```

If SKU is missing, display the project's standard empty-value representation.

---

## Cost

Display:

```text
unitCost
```

Use the existing money formatter.

Example:

```text
$0.45
```

---

## Price

Display:

```text
salesPrice
```

Use the existing money formatter.

Example:

```text
$0.75
```

---

## Market

Display:

```text
marketPrice
```

If market price is unavailable:

```text
-
```

Do not display `$0.00` unless zero is actually returned as a meaningful market price.

---

## Margin

Display:

```text
marginPercent
```

Example:

```text
40.0%
```

Recommended visual treatment:

- Normal/healthy margin: standard styling.
- Below target margin: warning styling.
- Negative margin: error styling.

Do not hard-code arbitrary margin thresholds in the frontend.

The backend should provide the pricing status.

The frontend should primarily use:

```text
pricingStatus
```

for status presentation.

---

## Stock

Display:

```text
quantityOnHand
```

Optionally show upcoming quantity as secondary information:

```text
250
+100 upcoming
```

If this makes the table too busy, keep Upcoming Qty in the detail drawer.

---

# 9. Status Display

Use status badges/chips according to existing frontend conventions.

## Inventory Status

Supported values:

```text
HEALTHY
LOW_STOCK
OUT_OF_STOCK
OVERSTOCK
```

Display labels:

```text
Healthy
Low Stock
Out of Stock
Overstock
```

---

## Pricing Status

Supported values:

```text
PROFITABLE
BELOW_TARGET_MARGIN
SELLING_BELOW_COST
PRICING_OPPORTUNITY
NO_PRICING_DATA
```

Display labels:

```text
Profitable
Below Target Margin
Selling Below Cost
Pricing Opportunity
No Pricing Data
```

Do not expose enum values directly to users.

---

# 10. Status Logic

Do not duplicate backend business rules in the frontend.

For example, do not calculate:

```text
salesPrice < unitCost
```

in multiple frontend components to decide pricing status.

The backend owns business status rules.

The frontend owns:

- Display label
- Badge presentation
- Filter selection
- User interaction

If the backend provides:

```json
{
  "pricingStatus": "SELLING_BELOW_COST"
}
```

the frontend should display:

```text
Selling Below Cost
```

---

# 11. Filters

Implement the following filters:

## Search

Search:

```text
Product name
Variant name
SKU
Barcode
```

Use the API's `keyword` parameter.

Recommended behavior:

- Debounce search if the project's existing listing pages use debouncing.
- Reset page to `1` when the search changes.
- Preserve other active filters.

---

## Location

Query parameter:

```text
locationId
```

Use the existing location dropdown/select component.

---

## Category

Query parameter:

```text
categoryId
```

Use the existing category component if available.

---

## Brand

Query parameter:

```text
brandId
```

Use the existing brand component if available.

---

## Status

The status filter should support the application's chosen status model.

If both inventory and pricing statuses are supported by the backend, prefer separate filters:

```text
Inventory Status
Pricing Status
```

Do not force two independent status dimensions into one dropdown.

If the API currently supports only one `status` parameter, follow the actual backend contract.

---

# 12. Quick Filter Tabs

Provide convenient filters:

```text
All
Needs Attention
Low Stock
Pricing
Profitable
Loss
```

These should make common business workflows fast.

## All

No additional attention filter.

---

## Needs Attention

Show products requiring review, such as:

```text
LOW_STOCK
OUT_OF_STOCK
BELOW_TARGET_MARGIN
SELLING_BELOW_COST
```

Use backend-supported status fields rather than duplicating business calculations.

---

## Low Stock

Show:

```text
LOW_STOCK
OUT_OF_STOCK
```

---

## Pricing

Show pricing-related issues:

```text
BELOW_TARGET_MARGIN
SELLING_BELOW_COST
PRICING_OPPORTUNITY
NO_PRICING_DATA
```

---

## Profitable

Show:

```text
PROFITABLE
```

---

## Loss

Show products where:

```text
expectedLoss > 0
```

Prefer a backend-supported filter/status if available.

Do not create a separate backend request parameter that does not exist just for frontend convenience.

---

# 13. Filter State

Filter state should be centralized.

Example conceptual state:

```ts
type ProductReportFilters = {
  keyword?: string;
  locationId?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};
```

Follow the project's existing state-management conventions.

Do not introduce Redux/Zustand/etc. only for this page if the application already has a simpler pattern.

---

# 14. URL State

If existing listing pages preserve filters in the URL, Product Report should follow the same pattern.

Recommended URL:

```text
/inventory/reports/product
```

Example:

```text
/inventory/reports/product?keyword=coca&locationId=1&page=1
```

This allows:

- Refreshing the page without losing filters.
- Sharing a filtered report.
- Browser back/forward behavior.
- Returning to the same report state.

If the project does not use URL query state for existing listings, follow the established project convention instead.

---

# 15. Pagination

Use the API pagination response:

```text
pagination.page
pagination.limit
pagination.total
pagination.totalPages
```

Requirements:

- Reset page to `1` when filters change.
- Keep the selected page size when appropriate.
- Show the total result count.
- Do not calculate pagination from the current `items.length`.
- Do not fetch all records just to paginate on the frontend.

---

# 16. Sorting

Support sorting only for fields supported by the backend.

Recommended:

```text
Item
SKU
Cost
Price
Market
Margin
Stock
```

When sorting:

```text
sortBy=marginPercent
sortOrder=DESC
```

Do not send arbitrary frontend field names directly if they do not match the backend API contract.

Create a small mapping when necessary.

Example:

```ts
const sortFieldMap = {
  itemName: "itemName",
  sku: "sku",
  unitCost: "unitCost",
  salesPrice: "salesPrice",
  marketPrice: "marketPrice",
  marginPercent: "marginPercent",
  quantityOnHand: "quantityOnHand",
};
```

---

# 17. Loading State

During the initial request:

- Show the existing table loading/skeleton component.
- Show summary card loading states if supported.
- Do not display an empty-state message while data is still loading.

During filter changes:

- Preserve the existing page structure.
- Use the application's standard loading behavior.

Do not create a custom loading animation.

---

# 18. Empty State

There are two different empty states.

## Initial State

If the report requires filters before searching, follow the existing listing convention.

Example:

```text
Filter to see data
```

If the API is designed to load data immediately, show the normal empty state only when the API returns no data.

---

## No Results After Filtering

When filters are applied and no records are returned:

```text
No Product Found
```

or use the application's standard table no-data text.

The empty state must not be confused with loading.

---

# 19. Error State

If the API fails:

- Use the project's existing error handling.
- Show the standard error message/toast.
- Allow retry where the existing listing pattern supports it.

Do not expose:

- SQL errors
- Stack traces
- Internal API details

to the business user.

---

# 20. Product Insight Drawer

Clicking a report row should open a detail drawer/modal using the existing application pattern.

Recommended sections:

## Product

```text
Item Name
SKU
Barcode
```

## Stock

```text
On Hand
Upcoming Qty
Reorder Point
Inventory Status
```

## Financial

```text
Unit Cost
Inventory Value
Sales Value
Expected Profit
Expected Loss
```

## Pricing

```text
Current Sales Price
Current Margin
Target Margin
Break-even Price
Recommended Price
Market Min
Market Average
Market Max
Pricing Status
```

Only display fields actually returned by the API.

If a field is not yet available from the backend, do not fabricate it on the frontend.

---

# 21. Action Column

The Action column should remain concise.

Possible actions:

```text
View
Review Price
Reorder
```

Examples:

```text
SELLING_BELOW_COST
→ Review Price

LOW_STOCK
→ Reorder

OUT_OF_STOCK
→ Reorder

PROFITABLE + HEALTHY
→ View
```

Prefer status-driven actions from the API if the backend eventually provides an explicit action.

Do not automatically update product prices or inventory from this report.

---

# 22. Price Review

If the application already has a product pricing/update flow, the Product Report may provide a navigation/action to it.

Example:

```text
Review Price
```

The Product Report should pass the product/variant ID.

Do not duplicate the price-edit form inside Product Report unless specifically required.

The report is primarily for analysis and decision support.

---

# 23. Number Formatting

Use existing application utilities.

Examples:

```text
0.45       → $0.45
15000      → $15,000.00
250        → 250
40         → 40.0%
```

Use the correct currency for the product/transaction context if the ERP supports multiple currencies.

Do not hard-code `$` if the existing application supports KHR/USD or other currencies.

Do not use manual:

```ts
value.toFixed(2)
```

everywhere if the project already has a shared formatter.

---

# 24. Missing Values

Use the existing empty-value convention.

Recommended:

```text
-
```

Examples:

```text
Market Price: -
Barcode: -
SKU: -
Upcoming Qty: -
```

Do not convert missing values into misleading zero values.

For example:

```text
null marketPrice
```

should not become:

```text
$0.00
```

unless the API explicitly defines zero as the business meaning.

---

# 25. Responsive Behavior

The table may contain many columns.

On smaller screens:

- Follow existing responsive table behavior.
- Prefer horizontal scrolling or the existing responsive table component.
- Do not shrink text to an unreadable size.
- Keep Item and Action accessible where possible.

The Product Insight drawer should remain usable on smaller screens.

---

# 26. Component Structure

Follow the project's existing frontend architecture.

A possible structure:

```text
product-report/
├── page/component
├── ProductReportSummary
├── ProductReportFilters
├── ProductReportTabs
├── ProductReportTable
├── ProductReportStatus
├── ProductReportDrawer
└── product-report.types
```

Do not create these files if the project uses a different established structure.

Reuse existing components such as:

```text
DisplayItem
DataTable
Select
DatePicker
Badge
Drawer
Modal
EmptyState
Pagination
Toast
```

when available.

---

# 27. API Types

Create strongly typed frontend types.

Example:

```ts
interface ProductReportItem {
  id: number;
  itemName: string;
  sku?: string | null;
  barcode?: string | null;
  unitCost?: number | string | null;
  salesPrice?: number | string | null;
  marketPrice?: number | string | null;
  marginPercent?: number | string | null;
  upcomingQty?: number | string | null;
  quantityOnHand?: number | string | null;
  totalCost?: number | string | null;
  totalSalesValue?: number | string | null;
  expectedProfit?: number | string | null;
  expectedLoss?: number | string | null;
  inventoryStatus?: string | null;
  pricingStatus?: string | null;
}
```

Adjust types to match the actual API response and existing frontend conventions.

If the project normalizes DECIMAL API values into numbers, use the project's actual type.

Do not blindly assume all financial API values are JavaScript numbers.

---

# 28. Avoid Business Logic Duplication

The frontend should not become another pricing engine.

Backend responsibilities:

```text
Cost calculation
Margin calculation
Profit calculation
Loss calculation
Inventory status
Pricing status
Recommended price
Business rules
```

Frontend responsibilities:

```text
Formatting
Displaying
Filtering
Sorting
Navigation
User interaction
```

This separation is important because pricing logic will later support the AI Pricing Assistant.

---

# 29. AI Pricing Assistant Preparation

The Product Report UI should be designed so a future AI Pricing Assistant can be added without redesigning the report.

Possible future action:

```text
Ask Pricing Assistant
```

The frontend could send:

```text
productVariantId
```

to the pricing assistant.

The AI assistant can then use structured backend data:

```text
Product
Effective Cost
Current Price
Target Margin
Current Margin
Market Price
Quantity On Hand
Sales History
```

Do not calculate or modify these values in the frontend for the AI.

The backend should remain the source of truth.

---

# 30. Permissions

Follow the application's existing permission system.

The Product Report page should respect:

- Inventory report view permission.
- Product view permission.
- Price update permission.
- Stock operation permission.

A user who can view the report should not automatically be allowed to modify prices or stock.

If the user lacks price-edit permission:

```text
Review Price
```

should not expose an unauthorized edit action.

Do not invent permission names if the project already has established permission constants.

---

# 31. Performance

The frontend must not:

- Fetch all products and calculate the report locally.
- Fetch ProductLocation separately for every row.
- Make one request per table row.
- Recalculate summary totals from every row.
- Trigger duplicate API requests unnecessarily.

Expected flow:

```text
Product Report Page
       |
       v
One report API request
       |
       +---- Summary
       |
       +---- Paginated Items
       |
       +---- Pagination
```

Use the existing query/caching pattern of the application if one exists.

---

# 32. State Reset Rules

When changing:

```text
Keyword
Location
Category
Brand
Status
Quick Filter
```

reset:

```text
page = 1
```

When changing page:

```text
keep all filters
```

When changing sort:

```text
keep all filters
```

When opening/closing the drawer:

```text
do not reset report filters
```

---

# 33. User Experience Priorities

Prioritize:

### 1. Scanability

The owner should understand the report quickly.

### 2. Attention

Problems should be easy to identify.

### 3. Context

Show cost, price, market, margin, and stock together.

### 4. Action

Make the next review/action obvious.

### 5. Detail on demand

Keep advanced information in the drawer rather than making the main table huge.

---

# 34. Recommended Final UI

```text
┌─────────────────────────────────────────────────────────────────┐
│ Product Report                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Total Products   Inventory Cost   Sales Value   Expected Profit │
│ 120              $15,000         $21,000        $6,000          │
│                                                                 │
│ Low Stock: 12                         Pricing Issues: 8         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Search products...                                              │
│                                                                 │
│ Location ▼   Category ▼   Brand ▼   Status ▼                    │
│                                                                 │
│ All | Needs Attention | Low Stock | Pricing | Profitable | Loss │
├─────────────────────────────────────────────────────────────────┤
│ Item          SKU      Cost    Price   Market  Margin Stock Act │
│ Coca Cola     CC330    $0.45   $0.75   $0.82   40%   250   View │
│ Product B     PROD-B   $10.00  $9.00   $11.00 -11%  50    Price│
│ Product C     PROD-C   $5.00   $7.00   $6.80   29%   10    Reor│
├─────────────────────────────────────────────────────────────────┤
│                         < 1 2 3 4 5 >                           │
└─────────────────────────────────────────────────────────────────┘
```

---

# 35. Definition of Done

- [ ] Product Report page is implemented.
- [ ] Existing application layout is reused.
- [ ] Product Report API is integrated.
- [ ] Strong API/frontend types are added.
- [ ] Summary cards are implemented.
- [ ] Search is implemented.
- [ ] Location filter is implemented.
- [ ] Category filter is implemented.
- [ ] Brand filter is implemented.
- [ ] Status filtering is implemented according to the backend contract.
- [ ] Quick filters are implemented.
- [ ] Product report table is implemented.
- [ ] Margin is displayed correctly.
- [ ] Inventory status is displayed correctly.
- [ ] Pricing status is displayed correctly.
- [ ] Missing values are handled correctly.
- [ ] Currency and number formatting follows project conventions.
- [ ] Pagination is implemented.
- [ ] Sorting is implemented using an allowlist.
- [ ] Filter changes reset pagination.
- [ ] Loading state is implemented.
- [ ] Empty state is implemented.
- [ ] Error state is implemented.
- [ ] Product insight drawer is implemented.
- [ ] Action column is implemented.
- [ ] Existing permission rules are respected.
- [ ] No business calculations are unnecessarily duplicated in the frontend.
- [ ] No N+1 API requests are introduced.
- [ ] Existing reusable components are reused where appropriate.
- [ ] Existing frontend conventions are followed.
- [ ] Existing tests are updated/added.
- [ ] Build passes.
- [ ] Tests pass.
- [ ] No unrelated functionality is changed.

---

# 36. Core Principle

> **The Product Report frontend should turn inventory data into something a business owner can scan, understand, and act on quickly.**

Keep the main table simple.

Use:

```text
Cost + Price + Market + Margin + Stock + Status + Action
```

to answer the most important questions.

Put deeper financial and pricing information in the Product Insight drawer.
