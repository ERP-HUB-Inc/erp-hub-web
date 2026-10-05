# MarketChain ERP — Item Detail Page Redesign Specification

## Objective

Redesign the existing **MarketChain ERP Item Detail page** to follow the layout and visual structure shown in the provided reference image.

The implementation must:

- Reuse the **existing Item Detail page data, API responses, state, permissions, routing, actions, and business logic** wherever available.
- **Do not remove or break existing functionality.**
- If the reference design contains information that does not exist in the current backend/API yet, use **clearly defined dummy/mock placeholder data** only for UI completion.
- Keep the code easy to replace with real API fields later.
- Follow the project's existing component structure and coding standards.
- Use the existing UI framework and **Lucide React icons** where icons are needed.
- Keep the page suitable for SME/business users: clean, readable, practical, and information-dense without looking crowded.

---

# 1. Overall Page Layout

Use a desktop-first responsive layout similar to the reference.

```text
Breadcrumb / Back
---------------------------------------------------------

Item Header / Main Item Information
---------------------------------------------------------

KPI Summary Cards
---------------------------------------------------------

Main Content                         Right Sidebar
┌───────────────────────────────┐   ┌──────────────────────┐
│ Stock Inventory by Location   │   │ Item Specifications  │
│                               │   ├──────────────────────┤
├───────────────────────────────┤   │ Cost & Pricing       │
│ Movement Log                  │   ├──────────────────────┤
│                               │   │ Internal Note        │
├───────────────────────────────┤   ├──────────────────────┤
│ Purchase History / Supplier   │   │ System Information   │
└───────────────────────────────┘   └──────────────────────┘
```

Recommended desktop width ratio:

```text
Main content: 65%–70%
Right sidebar: 30%–35%
```

For tablet/mobile:

- Stack sidebar below main content.
- Tables may use horizontal scrolling.
- KPI cards should wrap into 2-column or 1-column layout.
- Action buttons should wrap cleanly without overflow.

---

# 2. Breadcrumb

At the top show:

```text
← Back / Inventory / Items & Catalog / {Item Name}
```

Use the current application route/breadcrumb implementation if one already exists.

Example:

```text
Back / Inventory / Items & Catalog / Component Board 11 Pro
```

Do not hardcode the item name.

---

# 3. Item Header Card

Create a large summary card at the top.

## Left Section

Small label:

```text
INVENTORY ITEM
```

Main title:

```text
{item.name}
```

Example:

```text
Component Board (11 Pro Max Series)
```

Beside the item name show status badges when corresponding data is available.

Possible badges:

```text
In Stock
Active
Tracked Inventory
```

Use existing item status fields first.

Fallback dummy mapping is allowed only if fields do not exist.

Example badge logic:

```ts
stockQty > 0 => "In Stock"
stockQty <= 0 => "Out of Stock"

status === ACTIVE => "Active"

manageStock === true => "Tracked Inventory"
```

## Header Actions

Right aligned:

```text
Edit Item
Print Barcode
Stock Adjustment
```

### Edit Item

Use the current existing edit action/route.

### Print Barcode

Use current barcode functionality if available.

If not implemented yet, UI may be rendered with a temporary handler/TODO.

### Stock Adjustment

Use the current inventory adjustment action if available.

This is the primary button.

Example:

```text
+ Stock Adjustment
```

---

# 4. Item Meta Information

Below the title/header actions add a horizontal item metadata section.

Fields:

```text
Barcode
SKU
Category
Brand
Unit of Measure
Manage Stock
```

Example layout:

```text
BARCODE
000002

SKU
ITM-BOARD-11PRO

CATEGORY
Accessories / Logic Units

BRAND
General

UNIT OF MEASURE
Pcs

MANAGE STOCK
● Enabled
```

## Data Priority

Use existing fields such as:

```ts
item.barcode
item.sku
item.category
item.brand
item.unitOfMeasurement
item.manageStock
```

Adapt names to the real current model.

If a field is unavailable, show:

```text
—
```

Do not generate fake values for core item identity fields if the page already has real data.

---

# 5. KPI Summary Cards

Below the item header display 4 KPI cards.

## Card 1 — Retail Price

Label:

```text
RETAIL PRICE
```

Value:

```text
$8.00
```

Supporting label:

```text
MSRP Rate
```

Use existing sales price / retail price data.

Possible fields:

```ts
sellPrice
salesPrice
retailPrice
price
```

Use actual project field names.

---

## Card 2 — Unit Cost

Label:

```text
UNIT COST
```

Value:

```text
$450.00
```

Supporting label:

```text
Standard Purchase
```

Possible existing source:

```ts
purchasePrice
unitCost
cost
```

---

## Card 3 — Total On Hand

Label:

```text
TOTAL ON HAND
```

Value:

```text
0 Pcs
```

Supporting text:

```text
Across 9 Facilities
```

Prefer calculating from actual location inventory data:

```ts
totalOnHand = locations.reduce(
  (sum, location) => sum + location.onHand,
  0
);
```

If location inventory is not yet available, use the current total stock quantity.

---

## Card 4 — Inventory Valuation

Label:

```text
INVENTORY VALUATION
```

Value:

```text
$0.00
```

Supporting text:

```text
(Cost-based)
```

Recommended formula:

```ts
inventoryValuation = totalOnHand * unitCost;
```

Only calculate this client-side if the backend does not already provide an authoritative valuation.

---

# 6. Stock Inventory by Location

Main large card.

Title:

```text
Stock Inventory by Location
```

Description:

```text
Physical stock counts across registered branches & warehouses
```

Action button:

```text
Transfer Stock
```

Use the existing stock-transfer flow if available.

---

## Table Columns

```text
Location Name
Zone / Bin
On Hand
Reserved
Available
Status
```

Example:

| Location Name | Zone / Bin | On Hand | Reserved | Available | Status |
|---|---|---:|---:|---:|---|
| Head Office Store | HO-MAIN-01 | 0 Pcs | 0 | 0 | Out of Stock |
| Showroom – Branch 1 | SH1-SEC-A | 0 Pcs | 0 | 0 | Out of Stock |
| Main Warehouse | WH-AISLE-4 | 0 Pcs | 0 | 0 | Out of Stock |

## Status Logic

Recommended UI mapping:

```ts
available <= 0           => "Out of Stock"
available > 0 && <= min  => "Low Stock"
available > min          => "In Stock"
```

Where `min` uses existing reorder/minimum stock if available.

Suggested badge semantics:

```text
Out of Stock -> red
Low Stock    -> amber
In Stock     -> green
```

---

## Total Footer Row

At bottom of table show:

```text
TOTAL ACROSS LOCATIONS
9 Points of Storage
0 Pcs
0
0
—
```

Totals should be calculated from the current table data.

---

# 7. Item Specifications Card

Right sidebar card.

Title:

```text
Item Specifications
```

At top show a compact item identity block.

Example:

```text
XS Max / 11 Pro Board
UUID: b38f76a3-f174-45bf-8f4e-c05f0243959f
```

Prefer current fields where available.

Possible specification rows:

```text
Warranty Tier
Model Compatibility
Default Unit
Origin Country
```

Example dummy values when backend data does not exist:

```text
Warranty Tier        12 Months Commercial
Model Compatibility  A2160, A2217, A2215
Default Unit         Piece (Pcs)
Origin Country       Global Sourced
```

All dummy data must be isolated in an obvious mock structure.

Example:

```ts
const itemSpecificationFallback = {
  warrantyTier: "12 Months Commercial",
  modelCompatibility: "A2160, A2217, A2215",
  defaultUnit: "Piece (Pcs)",
  originCountry: "Global Sourced",
};
```

Do not mix dummy values directly inside JSX.

---

# 8. Cost & Pricing Analysis

Right sidebar card.

Title:

```text
Cost & Pricing Analysis
```

Show price comparison between purchase cost and selling price.

Rows:

```text
Unit Purchase Cost
Current Retail Price
Tax Applicable
```

Example:

```text
Unit Purchase Cost     $450.00
Current Retail Price   $8.00
Tax Applicable         Standard Exempt
```

Use real current data for purchase cost and retail price.

---

## Gross Margin Calculation

Recommended:

```ts
grossMarginDifference = retailPrice - unitPurchaseCost;
```

Optional margin percentage:

```ts
grossMarginPercentage =
  unitPurchaseCost > 0
    ? ((retailPrice - unitPurchaseCost) / unitPurchaseCost) * 100
    : 0;
```

---

## Negative Margin Warning

When:

```ts
retailPrice < unitPurchaseCost
```

show:

```text
Attention: Retail price ($8.00) is set below Unit Cost ($450.00).
Update prices to prevent negative gross profit.
```

Display:

```text
Gross Margin Diff   -$442.00
```

Use a clear red warning state.

When price is healthy, do not show the negative warning.

Instead show a positive/neutral margin status.

Possible badge:

```text
Healthy Margin
```

or

```text
Positive Margin
```

---

# 9. Movement Log

Large card below inventory-by-location.

Title:

```text
Movement Log
```

Description:

```text
Real-time ledger of transfers, dispatches, and inventory revaluations
```

Add filter tabs:

```text
All Logs
Receipts
Transfers
Adjustments
```

Prefer actual existing filters if already implemented.

---

## Table Columns

```text
Date & Time
Activity Type
Location / Destination
Qty Change
Reference / Doc #
Staff / Performed By
```

Example:

| Date & Time | Activity Type | Location / Destination | Qty Change | Reference / Doc # | Staff / Performed By |
|---|---|---|---:|---|---|
| Oct 12, 2026 14:20 | Stock Adjustment | Main Warehouse | -2 Pcs | ADJ-2026-089 | Marco Byte Admin |
| Oct 08, 2026 09:15 | Transfer In | Head Office Store | +10 Pcs | TR-004521 | Sarah Lin |
| Sep 27, 2026 11:30 | Sales Dispatch | Showroom – Branch 1 | -10 Pcs | SO-000018 | POS Register 04 |
| Sep 27, 2026 09:00 | Initial Receiving | Main Warehouse | +50 Pcs | PO-2026-012 | Inventory Lead |

---

## Quantity Styling

```ts
qtyChange > 0 => green
qtyChange < 0 => red
qtyChange === 0 => neutral
```

Examples:

```text
+10 Pcs
-2 Pcs
```

---

## Activity Badge Examples

```text
Stock Adjustment
Transfer In
Transfer Out
Sales Dispatch
Initial Receiving
Purchase Receipt
Return
Inventory Count
```

Map to existing transaction types wherever possible.

---

# 10. Purchase History & Supplier Procurement

Large card below Movement Log.

Title:

```text
Purchase History & Supplier Procurement
```

Description:

```text
Historical PO records, vendor acquisitions, and landing costs
```

Action:

```text
+ Create PO
```

Connect to the existing Purchase Order creation route if available.

---

## Table Columns

```text
PO Number
Order Date
Supplier / Vendor
Ordered Qty
Unit Cost
Total Amount
Status
```

Example:

| PO Number | Order Date | Supplier / Vendor | Ordered Qty | Unit Cost | Total Amount | Status |
|---|---|---|---:|---:|---:|---|
| PO-2026-012 | Sep 20, 2026 | Foxconn Industrial Components | 50 Pcs | $450.00 | $22,500.00 | Received |
| PO-2026-004 | Aug 14, 2026 | Apex Microtech Global | 25 Pcs | $440.00 | $11,000.00 | Completed |
| PO-2026-001 | Jun 02, 2026 | Shenzhen Logic Solutions | 10 Pcs | $450.00 | $4,500.00 | Completed |

If actual purchase history APIs exist, use them.

If not, use mock data isolated in:

```ts
const mockPurchaseHistory = [...]
```

---

# 11. Internal Note

Right sidebar card.

Title:

```text
Internal Note
```

Action:

```text
Save Note
```

Textarea placeholder:

```text
Type internal warehouse remarks or procurement updates...
```

Helper text:

```text
Visible to inventory managers & store clerks only.
```

Use existing note functionality if available.

If backend persistence does not exist yet:

- Keep textarea state locally.
- Add a TODO comment.
- Do not pretend the data is permanently saved.
- Optional temporary toast:

```text
Note UI is ready; persistence endpoint is not connected yet.
```

---

# 12. System Information

Right sidebar card.

Title:

```text
System Information
```

Rows:

```text
Record Created
Registered By
System Source
Last Synced Status
```

Example:

```text
Record Created       Sep 27, 2026 10:47
Registered By        Marco Byte Stores Admin
System Source        Enterprise POS Sync
Last Synced Status   ● Synchronized
```

Prefer current audit fields:

```ts
createdAt
createdBy
updatedAt
updatedBy
source
syncStatus
```

For unavailable fields, use placeholder values only through a fallback object.

---

# 13. Data Integration Rules

## Priority Order

Codex must follow this priority:

```text
1. Existing API/page data
2. Derived/calculated values from existing data
3. Existing shared application state
4. Dummy/mock data only when no real field exists
```

Do not overwrite existing real values with mock values.

---

# 14. Dummy Data Strategy

All placeholder data should live in a dedicated structure.

Example:

```ts
const mockItemDetailExtension = {
  specifications: {
    warrantyTier: "12 Months Commercial",
    modelCompatibility: "A2160, A2217, A2215",
    defaultUnit: "Piece (Pcs)",
    originCountry: "Global Sourced",
  },

  locations: [
    {
      id: 1,
      locationName: "Head Office Store",
      zone: "HO-MAIN-01",
      onHand: 0,
      reserved: 0,
      available: 0,
    },
  ],

  purchaseHistory: [],
};
```

Then resolve values using:

```ts
const warrantyTier =
  item?.warrantyTier ??
  mockItemDetailExtension.specifications.warrantyTier;
```

This makes future backend integration easy.

---

# 15. Suggested Component Structure

Avoid creating one huge page component.

Recommended:

```text
ItemDetailPage
│
├── ItemDetailHeader
├── ItemSummaryCards
│   └── MetricCard
│
├── ItemDetailMainGrid
│   │
│   ├── MainColumn
│   │   ├── StockByLocationCard
│   │   ├── MovementLogCard
│   │   └── PurchaseHistoryCard
│   │
│   └── Sidebar
│       ├── ItemSpecificationsCard
│       ├── CostPricingAnalysisCard
│       ├── InternalNoteCard
│       └── SystemInformationCard
```

Optional reusable pieces:

```text
SectionCard
StatusBadge
DataRow
MetricCard
EmptyState
MoneyValue
QuantityChange
```

Use the project's current shared components first before creating new ones.

---

# 16. Suggested TypeScript Models

Adapt to the real project types instead of duplicating them unnecessarily.

```ts
type StockLocation = {
  id: string | number;
  locationName: string;
  zone?: string;
  onHand: number;
  reserved: number;
  available: number;
  status?: string;
};

type InventoryMovement = {
  id: string | number;
  datetime: string;
  activityType: string;
  location: string;
  quantityChange: number;
  reference?: string;
  performedBy?: string;
};

type PurchaseHistoryItem = {
  id: string | number;
  poNumber: string;
  orderDate: string;
  supplier: string;
  orderedQty: number;
  unitCost: number;
  totalAmount: number;
  status: string;
};
```

---

# 17. Formatting Helpers

Reuse existing application utilities if available.

Otherwise create small helpers for:

```ts
formatCurrency()
formatQuantity()
formatDateTime()
formatPercent()
```

Example:

```ts
const formatCurrency = (
  value: number,
  currency = "USD"
) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
```

Do not repeat formatting logic directly throughout JSX.

---

# 18. Empty States

The page must still look professional when data is unavailable.

Examples:

## No stock location

```text
No stock locations found.
```

## No movements

```text
No inventory movement recorded yet.
```

## No purchase history

```text
No purchase history available.
```

Use the project's current Empty component/pattern if available.

---

# 19. Loading State

Use the current project loading/skeleton pattern.

Suggested skeleton areas:

```text
Header
4 metric cards
Stock table
Movement table
Purchase history
Sidebar cards
```

Avoid showing a completely blank page during loading.

---

# 20. Error Handling

Do not allow one failed secondary request to crash the complete Item Detail page.

For example:

```text
Item main API succeeds
Purchase history API fails
```

The page should still render item information.

Only the purchase section should show:

```text
Unable to load purchase history.
Retry
```

Use existing error handling conventions.

---

# 21. Permissions

Preserve existing permission logic.

Actions such as:

```text
Edit Item
Stock Adjustment
Transfer Stock
Create PO
Save Note
```

must continue to respect existing authorization/permission checks.

Do not expose buttons simply because they exist in the reference design.

---

# 22. Visual Design Rules

Follow the screenshot closely but also remain consistent with the MarketChain UI system.

## Cards

Use:

```text
white/light surface
thin neutral border
small-medium border radius
very subtle shadow or no shadow
comfortable padding
```

Avoid oversized shadows.

---

## Typography

Recommended hierarchy:

```text
Page title        22–28px / semibold-bold
Section title     14–16px / semibold
Metric value      20–24px / semibold-bold
Body text         12–14px
Metadata label    10–12px / uppercase / muted
Helper text       11–12px / muted
```

Use the existing application typography tokens where possible.

---

## Colors

Use semantic colors, not decorative random colors.

```text
Green  -> success / in stock / positive
Red    -> error / out of stock / negative margin
Amber  -> warning / low stock
Blue   -> transfer / informational
Purple -> optional transaction type
Gray   -> neutral metadata
```

Do not make the entire page overly colorful.

---

## Icons

Use `lucide-react`.

Suggested icons:

```ts
ArrowLeft
Pencil
Barcode
Plus
MapPin
ArrowRightLeft
Package
Boxes
DollarSign
WalletCards
ClipboardList
ShoppingBag
FileText
Info
AlertTriangle
NotebookPen
RefreshCcw
Warehouse
```

Use icons only where they improve scanning.

---

# 23. Responsive Rules

## Desktop

```text
4 KPI cards in one row
Main + sidebar layout
Tables full width
```

## Tablet

```text
2 KPI cards per row
Main/sidebar may still use 60/40 if enough width
otherwise stack
```

## Mobile

```text
1 KPI card per row
Sidebar below main content
Tables horizontally scrollable
Header actions wrap vertically/horizontally
Metadata becomes 2-column or single-column
```

Do not shrink text so much that it becomes unreadable.

---

# 24. Recommended Page Order

Final page order should be:

```text
1. Breadcrumb
2. Item Header
3. KPI Summary Cards

4. Main Content Grid
   LEFT:
   4.1 Stock Inventory by Location
   4.2 Movement Log
   4.3 Purchase History & Supplier Procurement

   RIGHT:
   4.4 Item Specifications
   4.5 Cost & Pricing Analysis
   4.6 Internal Note
   4.7 System Information
```

---

# 25. Business Logic Requirements

The following calculations should be derived safely.

## Available Stock

```ts
available = Math.max(onHand - reserved, 0);
```

Use backend provided `available` if it is authoritative.

---

## Inventory Valuation

```ts
inventoryValuation = totalOnHand * unitCost;
```

---

## Purchase Total

```ts
totalAmount = orderedQty * unitCost;
```

Use API total if available.

---

## Margin Difference

```ts
marginDifference = retailPrice - unitCost;
```

---

## Margin Status

```ts
if (retailPrice < unitCost) {
  status = "NEGATIVE";
} else if (retailPrice === unitCost) {
  status = "BREAK_EVEN";
} else {
  status = "POSITIVE";
}
```

Suggested labels:

```text
Negative Margin
Break Even
Positive Margin
```

---

# 26. Important Rules for Codex

Codex must inspect the current Item Detail implementation before making changes.

Do not blindly replace the page.

First identify:

```text
existing Item Detail component
existing API/data model
existing hooks
existing item interfaces/types
existing edit route
existing stock adjustment action
existing permission logic
existing formatting utilities
existing card/table components
existing design tokens
```

Then adapt the new layout around the current implementation.

---

# 27. Do Not Break Existing Flow

The redesign must preserve:

```text
Current item fetch
Current route params
Current edit flow
Current barcode behavior
Current item status logic
Current inventory logic
Current permissions
Current loading state
Current error handling
Current navigation
Current API contracts
```

Only change these when required for layout integration.

---

# 28. Avoid

Do not:

```text
- Replace working API data with mock values.
- Hardcode current screenshot values into the production page.
- Put all code in one huge component.
- Duplicate existing project utilities.
- Remove permissions.
- Remove existing buttons/actions without checking usage.
- Introduce a new UI library just for this page.
- Use excessive gradients.
- Use overly large cards.
- Use random colors.
- Hide important inventory information behind modals unnecessarily.
```

---

# 29. Implementation Strategy

Recommended development sequence:

```text
Step 1
Inspect current Item Detail page and its data model.

Step 2
Extract/reuse existing data and actions.

Step 3
Create the new overall responsive layout.

Step 4
Build Item Header.

Step 5
Build KPI summary cards.

Step 6
Build Stock Inventory by Location.

Step 7
Build sidebar cards.

Step 8
Build Movement Log.

Step 9
Build Purchase History.

Step 10
Connect real existing data.

Step 11
Add mock fallback data only for missing sections.

Step 12
Verify permissions and existing actions.

Step 13
Verify mobile/tablet layouts.

Step 14
Remove unnecessary duplicated code and finalize.
```

---

# 30. Final Expected Result

The final MarketChain Item Detail page should look like a professional inventory control dashboard rather than a simple item form.

At a glance, the business owner or staff member should understand:

```text
What item is this?
What is its SKU/barcode/category?
What is the selling price?
What does it cost us?
How much inventory do we have?
Where is the inventory located?
Is the selling price profitable?
What inventory movements happened?
Who changed the stock?
Which suppliers supplied this item?
What did previous purchases cost?
What internal notes exist?
When was this item created/synced?
```

The design should be very close in structure to the provided reference screenshot while still using the real MarketChain data model and preserving all current page behavior.

---

# Codex Task Prompt

Use the following directly with Codex:

```text
Please redesign the existing MarketChain ERP Item Detail page based on the attached reference screenshot and ITEM_DETAIL_REDESIGN.md.

Important:
1. Inspect the current implementation before changing anything.
2. Reuse all existing APIs, page data, hooks, route params, permissions, business logic, actions, and shared components.
3. Do not break the current Item Detail flow.
4. Use existing real data wherever available.
5. When a section in the reference screenshot requires data that does not exist in the current API/model, use isolated mock/dummy fallback data so the UI can still be completed.
6. Never replace existing real values with mock values.
7. Use lucide-react for icons.
8. Follow the existing MarketChain design system and frontend coding conventions.
9. Keep the design responsive.
10. Split the implementation into reusable components rather than creating one large page component.
11. Preserve current authorization/permission checks for actions.
12. Use current project formatting utilities/components before creating new ones.
13. Use semantic success/warning/error colors.
14. Implement the full layout:
    - Breadcrumb
    - Item header
    - Item metadata
    - Retail Price
    - Unit Cost
    - Total On Hand
    - Inventory Valuation
    - Stock Inventory by Location
    - Item Specifications
    - Cost & Pricing Analysis
    - Movement Log
    - Purchase History & Supplier Procurement
    - Internal Note
    - System Information
15. If some sections cannot yet connect to backend data, mark those mock sources clearly so they can easily be replaced by API data later.

Before coding, inspect the existing Item Detail page and list which fields/actions can already be reused and which parts require temporary fallback data. Then implement the redesign.
```
