# MarketChain ERP — Sales Order Detail Redesign Specification

## Objective

Modify the **existing Sales Order Detail page** so that it follows the approved Google Stitch design shown in the provided reference image.

This is an implementation specification for Codex.

The goal is to reproduce the **same information hierarchy, layout, section order, spacing, visual grouping, status presentation, action placement, and overall ERP interaction pattern** while preserving the existing MarketChain business logic and data model.

---

# 1. Critical Implementation Rules

Before making any UI changes:

1. Inspect the current Sales Order Detail page.
2. Inspect its API/data source.
3. Inspect existing TypeScript interfaces/types.
4. Inspect existing hooks.
5. Inspect existing status mappings.
6. Inspect permissions.
7. Inspect actions such as:
   - edit
   - print
   - invoice
   - payment
   - fulfillment
   - notes
8. Inspect reusable MarketChain components.
9. Inspect existing currency/date formatters.
10. Preserve all existing working behavior.

## Do NOT

- rebuild the Sales Order feature from scratch
- change backend API contracts unnecessarily
- hardcode fake production data
- duplicate business logic
- introduce another UI library
- remove current permission checks
- remove current routing/actions
- render `undefined`, `null`, or `NaN`
- force the API to support fields only because the reference design contains them

## Use

- React / Next.js
- TypeScript
- Ant Design
- `lucide-react`
- existing MarketChain design tokens/styles
- existing MarketChain components wherever possible

---

# 2. Final Page Order

The page must follow this order:

```text
Breadcrumb / Top Navigation

Order Header

Order Lifecycle

MAIN TWO-COLUMN CONTENT

LEFT
1. Line Items & Products
2. Payment & Settlement Breakdown
3. Documents & Paperwork
4. Order History & Audit Logs

RIGHT
1. Customer
2. Fulfillment & Delivery
3. Order Notes
4. Order Attributes
```

This ordering should remain consistent with the Stitch design.

---

# 3. Page Background & Overall Layout

Use a soft neutral application background.

Recommended visual direction:

```text
page background: #F8FAFC / very light neutral
cards: white
borders: subtle cool-gray
radius: medium
shadow: none or very subtle
```

Desktop structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb / top toolbar                                    │
├─────────────────────────────────────────────────────────────┤
│ Order Header                                                 │
├─────────────────────────────────────────────────────────────┤
│ Order Lifecycle                                              │
├──────────────────────────────────────┬──────────────────────┤
│ Main Content                         │ Sidebar              │
│ ~68%                                 │ ~32%                 │
└──────────────────────────────────────┴──────────────────────┘
```

Recommended width ratio:

- Main column: 66–70%
- Sidebar: 30–34%

Use responsive behavior.

On tablet/mobile:

- stack sidebar below main content
- preserve section order
- avoid horizontal scrolling

---

# 4. Breadcrumb / Top Navigation

Follow this structure:

```text
←   Sales   >   Orders   >   SO-000018
```

Use:

- back arrow
- breadcrumb labels
- current order number in stronger text

Suggested Lucide icons:

- `ArrowLeft`
- `ChevronRight`

On the far right display:

```text
Live Sync
Clock
Settings
```

Use only if these already make sense in the app.

If `Live Sync` is not currently backed by actual synchronization state, keep it as a non-functional visual placeholder or add a TODO.

Do not create fake real-time synchronization logic.

---

# 5. Order Header Card

Create a full-width white card directly under the breadcrumb.

## Left Side

Display:

```text
Order #SO-000018
```

Next to the title render status badges:

```text
[Fulfilled] [Unpaid] [Retail Sale]
```

Use existing order data.

Suggested semantics:

- Fulfilled → green
- Unpaid → red / danger
- Retail Sale → blue / info

Below the title, display compact metadata:

```text
Created Sep 27, 2026, 10:47 AM
Customer: Sarah Lin (TikTok #TK-9821)
Location: Marco Byte Stores
Channel: TikTok Shop / Social Commerce
```

Use small muted text and Lucide icons where appropriate.

Suggested icons:

- `CalendarDays`
- `UserRound`
- `Building2`
- `CircleDot`

## Right Side

Display actions:

```text
[ Edit Order ]
[ Print / PDF ]
[ Send Invoice ]

[ Collect Payment ]
```

`Collect Payment` should be the primary action.

Use existing functionality only.

Suggested icons:

- `Pencil`
- `Printer`
- `Mail`
- `CreditCard`

Rules:

- respect current permissions
- hide actions not supported
- do not invent API functionality
- preserve current handlers

---

# 6. Order Lifecycle Card

Create a full-width section below the order header.

Header:

```text
ORDER LIFECYCLE                         Last event: Today, 11:15 AM
```

Use uppercase small title styling similar to the reference.

Render five lifecycle steps:

```text
Order Placed
Confirmed
Fulfilled & Handed
Payment Pending
Order Closed
```

Visual states:

- completed → green
- current → amber/orange
- future → muted gray

Example:

```text
✓────────────✓────────────✓────────────◎────────────○
Order Placed Confirmed    Fulfilled     Payment      Order
                          & Handed      Pending      Closed
```

Under each stage display detail:

```text
Order Placed
Sep 27, 10:47 AM

Confirmed
Sep 27, 10:48 AM

Fulfilled & Handed
Sep 27, 11:15 AM

Payment Pending
$80.00 Outstanding

Order Closed
Pending final settlement
```

Important:

Use real current state whenever available.

Do not fake event timestamps.

If lifecycle events are not fully available from the backend:

- derive only safe state from existing order/payment/fulfillment status
- omit unavailable timestamps
- use neutral fallback copy

Possible implementation:

- Ant Design `Steps`
- or custom horizontal timeline for closer control

---

# 7. Main Two-Column Layout

Below lifecycle:

```text
LEFT COLUMN               RIGHT COLUMN

Line Items                Customer
Payment                   Fulfillment
Documents                 Notes
History                   Attributes
```

Use consistent vertical spacing between sections.

Recommended gap:

```text
16px–24px
```

---

# 8. Line Items & Products

Create the first left-column card.

Header:

```text
[icon] Line Items & Products   [1 Item]                 [Fully Fulfilled]
```

Use:

- `Package`
- count badge
- fulfillment badge

## Table Columns

Follow this layout:

```text
ITEM / SKU | STATUS | PRICE | QTY | TAX | TOTAL
```

Example row:

```text
[icon] XS Max Board
       SKU: b38f76a3-f174-45bf-8f4e-c05f0243959f
       Electronics • Standard Warranty

                         Dispatched   $8.00   10   $0.00   $80.00
```

Fields to map from existing line-item data:

- image or fallback icon
- product name
- SKU
- category
- variant
- warranty if available
- fulfillment status
- price
- quantity
- tax
- total

If a product image does not exist:

use a subtle square placeholder with:

- `Package`

Do not use fake external image URLs.

## Footer

Below the table show:

```text
All line items reserved from Marco Byte Stores Main Inventory.

Add line item +
```

Only show reservation information if it exists.

Only show `Add line item` if the current order state and permissions allow it.

---

# 9. Payment & Settlement Breakdown

Create the next left-column card.

Header:

```text
[icon] Payment & Settlement Breakdown                    [Unpaid]
```

Use:

- `CircleDollarSign`

The body uses two internal columns.

## Left Payment Metadata Block

Display:

```text
Payment Terms       Due on Receipt
Preferred Method    Cash / POS Terminal
Currency            USD ($)
```

Render inside a subtle light-background mini panel.

Use existing data only.

## Payment Warning

Below this panel display a contextual warning when:

```ts
isFulfilled && balanceDue > 0
```

Example:

```text
Goods were dispatched prior to complete payment confirmation.
Please collect balance upon hand-off or invoice settlement.
```

Use a small amber info icon such as:

- `CircleAlert`

Do not hardcode the warning for orders that are already paid.

---

# 10. Payment Summary

Right side of the payment card:

```text
Subtotal (1 item, 10 units)       $80.00
Discount                           $0.00
Estimated Tax (0%)                 $0.00
-----------------------------------------
Grand Total                        $80.00
Total Paid to Date                 $0.00
```

Below this create the highlighted balance area:

```text
BALANCE DUE

$80.00                    [ Record Payment ]
```

Design:

- pale amber background
- subtle amber border
- balance amount emphasized
- button aligned right

Use existing currency formatter.

Never hardcode `$` unless the current currency formatter outputs it.

Only show `Record Payment` if:

- balance > 0
- current state allows payment
- user has permission
- existing action/API supports it

---

# 11. Documents & Paperwork

Create the next left-column card.

Header:

```text
[icon] Documents & Paperwork              Generate Custom Document
```

Use:

- `FileText`

Display documents as compact horizontal cards.

Reference layout:

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Sales Order  │ │ Tax Invoice  │ │ Packing Slip │ │ Delivery Note│
│ OFFICIAL     │ │ UNPAID       │ │ READY        │ │ SIGNED       │
│ SO-000018    │ │ INV-2026-091 │ │ PS-000018-A  │ │ DN-000018    │
│ Preview      │ │ Download     │ │ Print        │ │ Preview      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Possible status semantics:

- Official → blue
- Unpaid → amber
- Ready → gray/blue
- Signed → green

Use real document data.

Do not generate fake document references.

If a document type does not exist, omit it.

Possible icons:

- `FileText`
- `ReceiptText`
- `PackageOpen`
- `Truck`
- `Eye`
- `Download`
- `Printer`

---

# 12. Order History & Audit Logs

Create the final left-column card.

Header:

```text
[icon] Order History & Audit Logs                Chronological
```

Use:

- `History`
- `Clock3`

Display a vertical timeline.

Example:

```text
● Items Handed Over / Dispatched                 11:15 AM
  10x XS Max Board picked up at Marco Byte Stores counter by customer.

● Order Confirmed                                10:48 AM
  Inventory reserved automatically from main stock room.

● Order Created                                  10:47 AM
  Initial draft generated from POS Terminal #04 for Walk In Customer.
```

Use real audit/history data.

Do not fabricate audit events.

If the project has an existing audit log component, reuse it.

---

# 13. Customer Sidebar Card

Create the first card in the right sidebar.

Header:

```text
[icon] CUSTOMER                                         Edit
```

Use:

- `UserRound`

Body:

```text
[ WI ]

Walk In Customer
Guest / Counter • 1st Order
```

Use Ant Design `Avatar`.

If customer avatar is missing:

- generate initials from customer name

Below add contact rows:

```text
Email        + Add email
Phone        + Add phone
```

Suggested icons:

- `Mail`
- `Phone`

Rules:

If actual values exist, display them.

If editing is supported, show:

```text
+ Add email
+ Add phone
```

If editing is not supported, show:

```text
—
```

Do not create fake customer edit logic.

---

# 14. Fulfillment & Delivery Sidebar Card

Header:

```text
[icon] FULFILLMENT & DELIVERY                 Dispatched
```

Use:

- `MapPin`
- `Truck`
- `PackageCheck`

Display:

```text
Method
In-Store Pickup / Counter Delivery

Pickup Location
Marco Byte Stores - Main Retail Outlet
Front Counter Register #4
```

Then show a subtle internal block:

```text
Shipping Address
Not required (Counter hand-off)
```

For delivery orders, display the actual shipping address instead.

Business logic should decide between:

- pickup information
- shipping information
- both

Do not copy text blindly.

---

# 15. Order Notes Sidebar Card

Header:

```text
[icon] ORDER NOTES
```

Use:

- `SquarePen`

Display:

```text
No notes added to this order yet.
```

Below use an Ant Design textarea:

```text
Add an internal staff note...
```

And:

```text
[ Save Note ]
```

Only make this interactive if the existing backend already supports notes.

If notes are read-only in the current application:

- render the current note
- omit Save button

Do not add fake local-only persistence.

---

# 16. Order Attributes Sidebar Card

Header:

```text
[icon] ORDER ATTRIBUTES
```

Use:

- `CircleGauge`
- or `ListFilter`

Display as compact key/value rows:

```text
Sales Type          Retail Direct
POS Register        Terminal 04
Handled By          Marco Byte Store Admin
Order Expiry        —
Expected Shipment   Immediate (Walk-in)
```

Use existing fields only.

Potential mapped fields:

- sales type
- register
- cashier/handled by
- sales person
- location
- order expiry
- shipment expectation
- channel
- reference number

Keep this section concise.

Do not dump the entire order object.

---

# 17. Typography

Follow the Stitch visual hierarchy.

Recommended:

## Page / Order Title

```text
24–28px
font-weight: 600–700
```

## Section Headers

```text
13–16px
font-weight: 600
```

For uppercase section labels:

```text
font-size: 12–13px
letter-spacing: subtle
```

## Main Text

```text
14px
```

## Secondary Text

```text
12–13px
muted neutral
```

## Financial Value

```text
16–18px
font-weight: 600
```

## Balance Due

```text
26–30px
font-weight: 700
```

---

# 18. Color Semantics

Use project tokens where available.

Suggested semantics:

```text
Success / Fulfilled / Dispatched
→ green

Danger / Unpaid
→ red / rose

Warning / Payment Pending / Balance Due
→ amber / orange

Info / Retail Sale / Document Official
→ blue / indigo

Neutral / Future / Disabled
→ slate / gray
```

Do not use random decorative colors.

Color should communicate state.

---

# 19. Buttons

Primary action:

```text
Collect Payment
```

Use the application's primary brand button style.

Secondary actions:

```text
Edit Order
Print / PDF
Send Invoice
```

Use outlined/neutral buttons.

Compact action buttons inside document cards should remain lightweight.

---

# 20. Icons

Use only `lucide-react`.

Suggested icon set:

```text
ArrowLeft
ChevronRight
CalendarDays
UserRound
Building2
CircleDot
Pencil
Printer
Mail
CreditCard
Package
PackageCheck
CircleDollarSign
CircleAlert
FileText
ReceiptText
PackageOpen
Truck
Eye
Download
History
Clock3
MapPin
SquarePen
CircleGauge
Check
Clock
Settings
```

Do not place icons everywhere.

Use them only when they improve scanability.

---

# 21. Empty States

Never show:

```text
undefined
null
NaN
```

Recommended fallbacks:

```text
Missing customer         → Walk In Customer / No customer
Missing email            → —
Missing phone            → —
Missing shipping address → Not available
Missing note             → No notes added to this order yet.
Missing optional value   → —
Missing image            → Package placeholder
```

Use real project conventions if they already exist.

---

# 22. Loading State

Preserve the existing loading behavior.

If redesigning loading state, use Ant Design `Skeleton`.

Skeleton should approximately reflect:

- header
- lifecycle
- product table
- payment card
- sidebar cards

Do not replace functional loading/error behavior unnecessarily.

---

# 23. Error State

Preserve current error handling.

If current order fetch fails:

- keep existing error component
- preserve retry if available
- do not show a partially fake order

---

# 24. Responsive Behavior

## Desktop

```text
Header actions aligned right
Lifecycle horizontal
Two-column content
Product table visible
Document cards in row
```

## Tablet

```text
Two columns if width allows
Header actions may wrap
Document cards may use 2 columns
```

## Mobile

Stack in this order:

```text
Breadcrumb
Order Header
Actions
Lifecycle
Line Items
Payment
Documents
History
Customer
Fulfillment
Notes
Attributes
```

On mobile:

- allow lifecycle horizontal scrolling if needed
- avoid table overflow
- convert product table into stacked item rows if necessary
- document cards become one column
- buttons may become full-width

---

# 25. Component Structure

Prefer clean feature-level components.

Suggested structure:

```text
SalesOrderDetailPage
├── SalesOrderBreadcrumb
├── SalesOrderHeader
├── OrderLifecycle
├── OrderItemsCard
│   └── OrderItemRow
├── PaymentSettlementCard
├── DocumentsCard
│   └── DocumentItem
├── OrderHistoryCard
├── CustomerCard
├── FulfillmentCard
├── OrderNotesCard
└── OrderAttributesCard
```

Do not create unnecessary abstraction if similar components already exist.

Reuse existing components first.

---

# 26. Data Mapping Layer

Avoid large conditional logic directly inside JSX.

Create presentation-level mappings where appropriate:

```ts
const orderHeaderData = ...
const orderStatuses = ...
const lifecycle = ...
const lineItems = ...
const paymentSummary = ...
const documents = ...
const customerInfo = ...
const fulfillmentInfo = ...
const orderAttributes = ...
const auditEvents = ...
```

These should map existing domain data into UI-friendly structures.

Do not duplicate backend state.

---

# 27. Financial Calculation Rules

Prefer server-provided totals whenever they are authoritative.

Use existing fields for:

- subtotal
- discount
- tax
- total
- amount paid
- outstanding balance

Only calculate client-side when current implementation already does so or the values are safely derivable.

Avoid inconsistent totals.

---

# 28. Permission Rules

Every actionable control must keep existing access rules.

Examples:

```text
Edit Order
Add line item
Collect Payment
Generate Document
Edit Customer
Save Note
Print
Send Invoice
```

Do not accidentally expose buttons by moving them into the redesign.

---

# 29. Existing Actions Must Continue Working

After redesign, verify:

```text
Edit Order
Print / PDF
Send Invoice
Collect Payment
Record Payment
Add Line Item
Preview Document
Download Document
Print Document
Edit Customer
Save Note
Back navigation
Customer navigation
```

Only test actions that currently exist.

---

# 30. Do Not Over-Copy the Reference

The Stitch design is the visual specification for:

- layout
- hierarchy
- section ordering
- card treatment
- statuses
- spacing
- operational UX

But the final page must use **real MarketChain data and business rules**.

Do not hardcode reference values such as:

```text
SO-000018
Sarah Lin
Marco Byte Stores
TikTok Shop
XS Max Board
$80.00
```

unless those values come from the current development data.

---

# 31. Codex Workflow

Codex should work in this order.

## Step 1 — Inspect

Inspect:

```text
Sales Order Detail page
API hooks
types
permissions
shared UI components
formatters
actions
current data model
```

## Step 2 — Plan

Before editing, identify:

```text
Which existing fields map to each Stitch section
Which reference fields are unavailable
Which components can be reused
Which actions already exist
```

## Step 3 — Implement

Refactor the current page to match the approved design.

Prioritize:

1. layout
2. data mapping
3. lifecycle
4. line items
5. payment breakdown
6. sidebar
7. documents
8. audit history
9. responsive behavior

## Step 4 — Clean Up

After implementation:

- remove unused imports
- remove obsolete duplicated UI
- remove dead components introduced by the old layout if no longer used
- resolve TypeScript errors
- avoid duplicated helper functions

## Step 5 — Verify

Run:

```text
TypeScript check
Lint
Existing test suite if available
```

Then manually verify:

```text
desktop layout
tablet layout
mobile layout
long product names
many products
missing customer details
missing note
paid order
unpaid order
fulfilled order
unfulfilled order
different currencies
permission-restricted user
```

---

# 32. Acceptance Criteria

The implementation is complete when:

- the page visually follows the approved Stitch design
- breadcrumb follows the same style
- order header matches the same hierarchy
- lifecycle is visible below the header
- left/right two-column structure matches the reference
- Line Items & Products appears first on the left
- Payment & Settlement appears second
- Documents & Paperwork appears third
- Order History appears fourth
- Customer appears first on the right
- Fulfillment appears second
- Notes appears third
- Attributes appears fourth
- existing order data is reused
- missing data has safe fallbacks
- existing actions still work
- permission checks remain intact
- page is responsive
- no new unnecessary dependency was introduced
- TypeScript passes
- no duplicated old layout remains

---

# 33. Final Visual Target

The final page should feel like:

```text
modern ERP
clean
professional
compact
easy to scan
operational
financially clear
status driven
SME-friendly
```

The user should understand within a few seconds:

```text
What order is this?
Who placed it?
What items were ordered?
Has it been fulfilled?
Has it been paid?
How much remains?
What documents exist?
What happened to the order?
Who is the customer?
How was it fulfilled?
What should staff do next?
```

Use the supplied Stitch screenshot as the **main visual reference** and reproduce its layout and UX closely while keeping MarketChain's real data, business logic, permissions, and existing Ant Design + lucide-react stack.
