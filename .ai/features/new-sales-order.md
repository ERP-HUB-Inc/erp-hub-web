Implement the complete **manual Sales Order creation form** shown in the attached screenshot within my existing application.

Read the existing design system Markdown, frontend rules, and relevant project instructions first. Inspect the current Sales Orders page and reuse its existing order creation APIs, customer components, product selectors, inventory services, payment configuration, and fulfillment flows.

Use the screenshot as the visual reference. Include every visible section and control. Implement the actual application screen rather than a standalone mockup.

## 1. Entry point and overall layout

- Open this screen from the existing manual Create Sales Order action.
- Keep this flow separate from Quick Sale (Chat Paste).
- Follow existing routing and navigation conventions.
- Use a pale background with white rounded section cards, subtle borders, dark navy text, soft blue input backgrounds, and green primary actions.
- Desktop layout: approximately two-thirds width for the main column and one-third for the right sidebar.
- Main column:
  1. Order Channel & Origin.
  2. Order Line Items.
  3. Fulfillment & Courier Dispatch.
- Right sidebar:
  1. Customer Recipient.
  2. Payment & Terms.
  3. Financial Summary.
  4. Internal Warehouse / Packer Notes.
- Include the full-width sticky bottom action bar.
- On smaller screens, stack sections in a logical reading order without losing fields or actions. Allow the line-item table to scroll horizontally.
- Reuse existing design tokens, icons, typography, and form components. Support Khmer and English without clipping characters.

## 2. Page header

Reproduce:

- Title: **New Sales Order**.
- Small **MANUAL CREATION** badge.
- Status badge with dot: **Draft · Unsaved SO #SO-00059** in the reference state.
- Subtitle:
  “Create and dispatch an order directly with instant inventory reservation, custom courier allocation, and payment terms.”
- Right-aligned actions:
  - Discard.
  - Save as Draft with save icon.
  - Green Create & Confirm Order button with lightning icon.
  - Attached dropdown chevron forming a split button.

Use the real order reference and lifecycle state. Do not fabricate or permanently allocate an order number on the frontend. Before a reference exists, show an appropriate unsaved label.

Only populate the split-button menu with actions supported by the existing application. Do not invent order operations.

## 3. Order Channel & Origin card

Include:

- Store icon and **Order Channel & Origin** heading.
- Upper-right **ORIGIN ID: SRC-MANUAL-01** reference label, using actual origin data when available.
- Field label: **Capture Source / Sales Channel**.
- Six selectable channel tiles with icons, title, and subtitle:
  1. Phone Call — Direct Manual.
  2. Telegram — Bot Direct.
  3. Messenger — Page Inbox.
  4. TikTok Shop — Social Cart.
  5. Walk-In — Toul Kork Flagship.
  6. B2B Trade — Corporate Term.
- Phone Call selected in the reference, using a solid green background and white text.
- Unselected tiles use pale blue backgrounds and dark text.

Below the tiles, include three aligned fields:

### Account Officer / Assignee
- Avatar/initials.
- Selected assignee, “Alex Rivera” in the reference.
- Right-side “Lead” role label.
- Use the existing authorized user selection behavior.

### Stock Bay & Depot
- Warehouse/depot selector.
- Reference: “Main Warehouse (Toul Kork Hub - Bay A04)”.
- Green dot and **Active Sync** indicator above the field.
- Show sync status only when supported by actual service state.

### Applied Price Tier
- Price-tier selector.
- Reference: “Standard Retail (USD $ Default)”.

Changing the channel must not connect to external platforms automatically. These options record the order’s source unless the existing application explicitly supports more.

Changing warehouse or price tier must follow existing stock and pricing rules, revalidate affected items, and protect manual edits.

## 4. Customer Recipient card

Include:

- Customer icon and **Customer Recipient** heading.
- Upper-right **+ New Customer** action.
- A tinted customer information panel containing:
  - Circular initials avatar, “CV” in the reference.
  - Customer name: Chea Vibol.
  - Phone: +855 12 889 204.
  - Green **Repeat (5 Orders)** badge at the top right.
  - **Destination Address** label.
  - **Change Address** action.
  - Location icon and address:
    “#42, Street 315, Sangkat Boeng Kak 1, Khan Toul Kork, Phnom Penh, Cambodia”.
- A separate information strip below:
  “Customer prefers Telegram notification with real-time driver tracking link once packed.”

Provide an existing-customer search/selection interaction within this card, even though the screenshot shows the selected state. New Customer must use the existing customer creation flow.

Change Address must allow selecting or editing the destination address through existing components.

Use actual customer history and notification preferences. Do not hardcode repeat counts, contact details, or messaging capabilities. Preserve phone numbers as strings.

## 5. Order Line Items card

Header:

- Table/list icon.
- **Order Line Items** title.
- Small count badge: **2 Items · 3 Units** in the reference.
- Right-side actions:
  - Quick Catalog with catalog icon.
  - Add Custom SKU with plus icon.

Search toolbar:

- Barcode/scan icon at the left.
- Search input:
  “Search item name, SKU, or scan barcode (Press F2 to focus)…”
- F2 keyboard hint and scanner icon at the right edge.
- Separate **Lookup** button with search icon.
- F2 should focus this input without interfering with other form interactions.

Table columns, in order:

1. #
2. ITEM DESCRIPTION & LOCATION
3. QUANTITY
4. UNIT PRICE
5. DISCOUNT
6. TAX
7. LINE TOTAL
8. ACTION

Each row must include:

- Two-digit row number.
- Product icon or existing product image inside a rounded tinted square.
- Product name.
- SKU badge.
- Warehouse bay/location.
- Stock badge with status text and colored dot.
- Quantity stepper with minus, value, plus.
- Unit label beneath quantity, such as “Units (Pcs)”.
- Editable unit price.
- Smaller MSRP reference beneath the price when available.
- Discount control.
- Tax control.
- Bold line total with currency beneath.
- Duplicate action.
- Delete action.

Reference rows:

### Row 01
- XS Max Logic Board Replacement.
- SKU: 000476.
- Bay-A04-R2.
- Green badge: 15 in stock (Good).
- Quantity: 2.
- Unit price: 8.00.
- MSRP $8.50.
- Discount: 0%.
- Tax: 0% (Exempt).
- Line total: $16.00 USD.
- Processor/chip icon.

### Row 02
- IRVINS Salted Egg Salmon Skin 105g.
- SKU: 000892.
- Bay-B01-S3.
- Red badge: 4 in stock (Low Stock).
- Quantity: 1.
- Unit price: 1.00.
- MSRP $1.20.
- Discount: 0%.
- Tax: 0% (Exempt).
- Line total: $1.00 USD.
- Food icon.

Below the table:

- Left action: **+ Add another line item (or hit Enter)**.
- Right mint status strip with verification icon:
  “Real-time inventory check: All 3 units reserved from Toul Kork Hub”.

Behavior:

- Search, barcode lookup, Quick Catalog, and adding another line must use existing product selection services.
- Add Custom SKU must follow existing permissions and custom-item rules.
- Duplicate and delete must update the form and totals correctly.
- Apply existing quantity, unit, price override, discount, tax, and stock validation.
- Distinguish distinct item lines from total units.
- Define Enter behavior within the product-entry context only. Enter in textareas must remain a newline.
- Show stock checks and reservation messages accurately.
- Do not claim inventory is reserved after merely checking availability.
- Follow the backend’s actual reservation lifecycle and release/expiry rules. Avoid introducing reservations on each keystroke.

## 6. Fulfillment & Courier Dispatch card

Include:

- Truck icon and **Fulfillment & Courier Dispatch** heading.
- Top-right **Standard SLA: ~45 mins** reference indicator, displayed only when supported by configured data.

Three selectable fulfillment tiles:

1. **Courier Delivery**
   - Delivery icon.
   - Subtitle: Grab Express / J&T Motor.
   - Selected with a mint background and dark green icon tile.

2. **Self-Pickup**
   - Store/pickup icon.
   - Subtitle: Customer Counter Pick.

3. **Scheduled Freight**
   - Truck icon.
   - Subtitle: Pallet / Bulk Delivery.

Below the tiles:

### Designated Fleet Provider
- Dropdown.
- Reference: Grab Express (On-Demand 2-Wheel Motor).

### Automated Dispatch Dispatcher
- Preserve the screenshot’s field placement; improve the label to “Automatic Dispatch” if consistent with the project’s terminology.
- Checked checkbox.
- Reference text:
  “Assign Grab Express tracking #GB-8924 on submit”.

Do not generate or imply a tracking number before the courier service actually assigns one. Before submission, use truthful wording such as “Request courier dispatch and tracking on confirmation”.

### Courier Delivery Instructions & Waybill Remarks
- Full-width multiline textarea.
- Reference:
  “Ring bell, house with blue gate. If unreachable call customer directly.”

Fulfillment behavior:

- Courier selection and fees must come from existing configuration.
- Show or require fields appropriate to Courier Delivery, Self-Pickup, and Scheduled Freight.
- Preserve entered values when switching modes where practical.
- Only invoke dispatch at the correct saved/confirmed order stage.
- A dispatch failure must not create a duplicate order. Offer a retry against the saved order.

## 7. Payment & Terms card

Include:

- Payment icon and **Payment & Terms** heading.
- Upper-right status badge: **Unpaid / Pending COD** in the reference.
- Four selectable payment tiles in a two-column grid:
  1. Cash on Delivery — selected in green.
  2. KHQR / Bakong.
  3. ABA Transfer.
  4. Net 15 / 30 Terms.
- Matching icons for each payment method.
- Bottom row:
  - Left: Due Date:
  - Right reference: Immediate on Handover (Oct 11, 2026).

Use the actual business date and payment terms rather than the screenshot date.

Payment status and payment method must remain separate. Selecting transfer or KHQR must not mark an order paid without the existing confirmation process.

For credit terms, use existing eligibility, permissions, term selection, due-date calculation, and credit rules. Display additional required fields through existing patterns without omitting the reference card.

## 8. Financial Summary card

Include:

- **Financial Summary** heading.
- Upper-right **USD BASE** label.

Summary rows:

- Line Items Subtotal (3 units) — $17.00.
- Order Discount with inline **+ Coupon** action — -$0.00.
- Delivery Fee (Grab Express) with **FREE PROMO** badge.
  - Original $1.50 struck through.
  - Discounted $0.00 in green.
- VAT / GST (0% Exempt) — $0.00.

Then:

- Thin divider.
- **Grand Total** label.
- Large dark green **$17.00**, aligned right.
- Subtitle: Currency: US Dollar.

Tinted currency panel:

- Cambodian Riel (KHR).
- Right-aligned **~69,700 KHR**.
- Rate detail: **Fixed Peg: $1.00 USD = 4,100.00 KHR** in the reference.

Use the application’s configured exchange rate. Prefer the truthful label “Exchange rate” unless “Fixed Peg” is an established application term. Do not hardcode the reference rate or conversion.

Bottom information strip with shield icon:

“Driver will collect $17.00 cash or scan KHQR at door.”

Show this message only when the selected payment and fulfillment flow supports it. Otherwise adapt the wording to the actual collection method.

Calculation behavior:

- Recalculate from current items, quantities, prices, line discounts, order discount, coupons, taxes, delivery fees, and valid promotions.
- Reuse existing money utilities and rounding rules.
- Preserve the backend’s calculation order and avoid double-applying discounts or taxes.
- The server must validate authoritative totals during save.
- + Coupon must open the existing coupon interaction.
- FREE PROMO and struck-through delivery fees appear only when a real promotion applies.
- Update all totals in the header/footer and summary from one consistent form state.

## 9. Internal Warehouse / Packer Notes card

Include:

- Notes icon.
- **Internal Warehouse / Packer Notes** heading.
- Multiline tinted textarea.
- Reference:
  “Check package seals and ensure double-bubble wrap on electronics logic board.”

Save these as internal notes using the existing order data structure. Keep them separate from customer-facing delivery instructions and waybill remarks.

## 10. Sticky bottom action bar

Reproduce the full-width white bottom bar with a subtle top border/shadow.

Left side:

- Status dot.
- Order reference: SO-00059.
- Separator dot.
- 2 Items (3 Units).
- Separator dot.
- Customer name: Chea Vibol.
- Separator dot.
- Green fulfillment label: Grab Express Delivery.

Right side:

- Small **PAYABLE:** label.
- Green **$17.00**.
- Small **(COD)** label.
- Discard button.
- Save Draft button.
- Green Create & Confirm Order button with check-circle icon and keyboard shortcut hint.

All information must reflect actual form state. On small screens, wrap or compact the bar while keeping actions accessible. Add page bottom padding so it never covers content.

Header and footer actions must call the same handlers, share validation and loading state, and prevent duplicate submissions.

Only display a keyboard shortcut hint if that shortcut is implemented and safe around text inputs.

## 11. Form lifecycle and integration

- Use the existing form library, validation conventions, API client, authorization, and error handling.
- Start with a clean production form and configured defaults. Do not prefill the screenshot’s customer or products.
- Use screenshot values only in a development fixture for visual comparison.
- Draft saving must follow existing incomplete-order rules.
- Confirmation must validate required customer, line-item, stock, fulfillment, payment, and term fields.
- Preserve form data after API failure and show actionable field or form errors.
- Warn before discarding meaningful unsaved changes using the existing application pattern.
- Reuse existing draft persistence if available; do not introduce browser storage for customer data without an established project convention.
- Refresh or invalidate the appropriate order lists, statistics, and inventory queries after successful operations.
- Follow existing post-save navigation behavior.
- Do not fake successful stock reservation, payment verification, courier booking, or order confirmation.
- If a required integration is missing, isolate it through the existing service pattern and report the exact remaining dependency.

## 12. Visual and functional verification

Compare the implementation against the screenshot and verify that all of these are present:

- Complete header, both badges, description, and split action button.
- All six channel tiles and all three origin-related fields.
- Customer selection, New Customer, repeat badge, address change, and preference strip.
- Both item toolbar actions, search, F2 hint, scanner icon, Lookup, every table column, duplicate/delete controls, add-line action, and stock/reservation strip.
- All three fulfillment tiles, SLA, courier dropdown, dispatch checkbox, and delivery instructions.
- All four payment methods, payment status badge, and due date.
- Every summary row, coupon action, delivery promotion treatment, grand total, currency conversion panel, and collection strip.
- Internal warehouse notes.
- Complete sticky bottom bar with live order details and all actions.

Run appropriate lint/type checks and relevant existing tests. Verify desktop and mobile layouts, calculations, warehouse/price-tier changes, draft saving, confirmation, errors, and repeated-click protection.

Implement the complete feature. Finish by reporting changed files, working integrations, validation performed, and any remaining dependencies.