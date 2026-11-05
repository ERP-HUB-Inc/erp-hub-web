Enhance my existing POS checkout/payment modal to match the attached screenshot as closely as possible.

Read DESIGN.md, UI_DESIGN_SYSTEM.md, frontend/backend rules, and applicable project instructions first. Inspect the existing cart totals, discounts, exchange rates, payment methods, cash handling, receipts, and checkout APIs.

Reuse existing components, Lucide icons, money utilities, payment integrations, and form/state patterns.

Implement this within the existing POS checkout flow. Preserve the surrounding POS screen, sidebar, header, branch, terminal, and shift context.

## 1. Modal composition

Recreate the screenshot’s full payment dialog:

- Dark navy header across the top.
- Left white order-summary column, approximately 42% width.
- Right pale gray-blue payment-entry column, approximately 58% width.
- Thin vertical divider.
- Rounded outer corners, approximately 26px.
- Subtle outer border and shadow.
- Dimmed backdrop.
- Wide desktop modal with approximately 24–40px viewport margins.
- Constrain height to the viewport and provide sensible internal scrolling.

Do not scale the screenshot into one fixed-size canvas. Match its proportions at desktop widths and adapt responsively.

Use:
- Dark navy: approximately #0F172A.
- Primary teal: approximately #14B8A6.
- Deep teal text: approximately #115E59.
- Pale mint: approximately #F0FDFA.
- Pale neutral surface: approximately #F8FAFC.
- Border: approximately #E2E8F0.
- Warning yellow for the USD equivalent badge.
- Rose/red for discounts, errors, and backspace.

Use the existing English font and an appropriate Khmer fallback. Financial values use tabular numerals and a suitable monospace style where shown.

## 2. Dark header

Left:
- Teal rounded-square payment/wallet icon tile.
- Bold bilingual title: **Complete Payment / ទូទាត់ប្រាក់**.
- Outlined teal-tinted pill containing actual order number and reference.
  - Reference: Order #187 (SO-000187).
- Subtitle containing actual store name and store ID.

Right:
- Dark outlined customer pill with teal user icon and current customer name.
- Small Esc keycap.
- Close X icon.

Match the screenshot’s alignment and spacing. Allow long store/customer names to truncate safely.

Closing follows existing checkout-cancellation rules. Do not discard a pending external payment attempt silently.

## 3. Left column: Amount Due banner

Large rounded banner with a dark teal-to-navy gradient.

Top row:
- Mint uppercase bilingual amount-due label.
- Right compact outlined exchange-rate pill.
  - Reference: 1 USD = 4,100៛.

Bottom row:
- Large bold KHR amount on the left.
- Yellow rounded USD amount badge on the right.

Reference:
- 22,100៛.
- $5.40.

Use actual payable totals, exchange-rate snapshots, and configured rounding. Keep rate and amounts readable without overlap.

## 4. Order items and totals card

White/light card with rounded border.

Table columns:
1. ITEM DESCRIPTION / bilingual label.
2. QTY.
3. DISC.
4. AMOUNT.

Rows:
- Bold product name, including Khmer when available.
- Secondary SKU and original unit price.
- Centered quantity.
- Pale pink discount badge, such as -10%.
- Right-aligned discounted amount in USD.
- Smaller KHR equivalent below.

Reference fixture:
- SKU: FAIZ-CUT-01.
- Original unit price: $6.00.
- Quantity: 1.
- Discount: 10%.
- Line amount: $5.40.

Below the item rows:
- Subtotal.
- Discount in red.
- Dashed divider.
- Bold Grand Total, with teal final amounts.

Show actual cart lines and existing pricing breakdowns. Preserve taxes, fees, and other required totals even if absent from this sample.

Use the existing pricing engine. Do not recalculate discounts differently inside the payment modal.

For long orders, scroll the item list while keeping totals accessible.

## 5. Tendered and Change Due card

Outer pale bordered card.

Top row:
- Label: **Tendered** with the existing Khmer translation.
- Right-aligned total tendered in KHR.
- Smaller USD equivalent.

Inside:
- Large pale green change panel.
- Green dot and **CHANGE DUE** bilingual heading.
- Right small badge: **KHR Balance**.
- Large KHR change amount.
- Right USD equivalent.

Reference:
- Tendered: 50,000៛.
- Change: 27,900៛.
- Approximately $6.80 USD.

Bottom inset strip:
- Lightbulb icon.
- **Suggested Cash Return:**.
- Right example: **$6.00 + 3,300៛**.

Calculate from actual tender and payable amount.

States:
- Insufficient tender: show remaining amount due clearly.
- Exact tender: show zero change.
- Excess tender: show change due.
- Invalid input: show an actionable validation error.

Suggested cash return must reconcile exactly under configured exchange/rounding rules. Use supported denominations and cash-drawer availability only if that data exists; otherwise label it as a suggestion without claiming availability.

## 6. Left-column footer

At the bottom:
- Thin divider.
- Checked teal checkbox.
- **Print Receipt** with the existing Khmer translation.
- Small F9 keycap.
- Right muted actual POS/app version.

Bind receipt printing to the existing preference and print workflow.

Do not hardcode “Byte POS v2.6.4” or invent a version.

Receipt/printing failures must not rerun an already completed payment.

## 7. Payment-method cards

Across the top of the right column, show four equal selectable cards:

1. Cash.
2. Bakong / QR.
3. Debit / Card.
4. Split Tender.

Each card:
- White background.
- Rounded corners, approximately 20px.
- Thin pale border.
- Centered icon above a bold English label.
- Smaller Khmer label underneath.
- Approximately 135–145px height at the reference scale.

Selected Cash:
- Strong teal border.
- Subtle outer mint ring.
- Deep teal label.
- Small top-right shortcut badge: 1.

Bakong:
- Phone/QR visual.
- Small red KHQR badge where an existing approved asset is available.

Use existing icons or assets, rather than inconsistent platform emoji where matching outline icons are available.

Selecting a method updates the entry area. Preserve entered state according to existing checkout rules.

Only enable methods supported by the current branch, terminal, permissions, and backend.

## 8. Cash inputs

White rounded bordered panel containing two equal columns.

### Cash (KHR)

Header:
- Cambodian flag or existing currency asset.
- Bold bilingual Cash (KHR) label.
- Right small outlined **Active** badge when focused.

Input:
- Large right-aligned amount.
- KHR suffix.
- Approximately 76px height.
- Strong teal border when active.
- Pale mint/white background.

Below:
- Muted right-aligned USD equivalent.

### Cash (USD)

Header:
- Currency icon.
- Bold bilingual Cash (USD) label.
- Right muted exchange-rate label.

Input:
- Same size and alignment.
- USD suffix.
- Neutral border when inactive.

Below:
- Muted KHR equivalent.

Behavior:
- Clicking an input makes it the keypad target.
- Derive Active styling from actual focus/entry state.
- Support permitted USD decimal precision and KHR increments.
- Allow mixed USD/KHR cash when supported.
- Combine their values using the transaction’s exchange-rate snapshot.
- Do not double-count converted equivalents as additional tender.
- Preserve caret/input behavior for physical keyboard entry.
- Reject negative, malformed, nonfinite, and out-of-range values.

## 9. Quick Cash section

Below the cash inputs, use a two-part layout:
- Left approximately 60%: quick-cash controls.
- Right approximately 40%: numeric keypad.

Quick Cash header:
- Teal lightning icon.
- Bold bilingual **Quick Cash** label.
- Right segmented **KHR / USD** selector with currency flags.
- Selected currency uses a white raised segment.

Full-width Exact Cash button:
- Pale mint background.
- Teal border.
- Teal dot.
- Bilingual **Exact Cash** label.
- Right actual payable amount and equivalent.

Below, a two-column grid of quick-cash cards.

Reference options:
- 22,200៛ → +100៛ change.
- 23,000៛ → +900៛ change.
- 30,000៛ → +7,900៛ change.
- 50,000៛ → +27,900៛ change.
- 100,000៛ → +77,900៛ change.
- $10.00 USD → return amount/equivalent.

Card styling:
- White background.
- Pale border.
- Approximately 18–20px radius.
- Bold centered amount.
- Smaller calculated change below.
- Selected 50,000៛ card uses mint background and strong teal border.
- Foreign-currency suggestion uses a pale amber surface and amber border as shown.

Generate options from existing denominations/configuration. Do not hardcode screenshot amounts for every order.

Define quick-cash behavior clearly: selecting a card sets the tender for its currency rather than repeatedly adding the same amount. Keep mixed-currency tender behavior consistent and visible.

## 10. Numeric keypad

White rounded bordered panel.

Three-column grid:

1 | 2 | 3
4 | 5 | 6
7 | 8 | 9
00 | 0 | Backspace

Buttons:
- Equal sizes.
- Pale gray-blue background.
- Thin border.
- Approximately 14px radius.
- Large dark monospace numbers.
- Backspace uses a pale pink surface and red icon.

Bottom:
- Thin divider.
- Two compact increment buttons:
  - +5,000៛.
  - +10,000៛.

Bind digits, backspace, and increments to the active cash input.

When USD is active, provide an accessible decimal-entry mechanism and appropriate currency-specific increments. Do not make decimal USD amounts impossible merely to copy the KHR screenshot.

Use the existing amount-entry model to avoid malformed leading zeros and formatting/caret problems.

## 11. Bottom payment actions

Below a divider:

Left:
- Outlined **Cancel** button with Esc keycap.
- Outlined **Reset** button with F5 keycap.

Right:
- Large teal **✓ Confirm Payment** button.
- Existing Khmer translation.
- Darker teal Enter keycap on the right.
- Approximately 72–76px height at the reference scale.
- Rounded corners and subtle shadow.

Behavior:
- Cancel follows existing cancellation rules.
- Reset clears tender/payment draft inputs without changing cart items or discounts.
- Confirm validates method, amount, order state, branch/terminal/shift, and permissions.
- Disable confirmation while invalid or pending.
- Prevent repeated clicks/Enter from creating duplicate payments.
- Use existing backend idempotency and reconciliation behavior.
- Preserve recoverable input on failure.

Keyboard shortcuts:
- Enter: Confirm.
- Esc: Cancel.
- F5: Reset while this modal is active.
- F9: Toggle Print Receipt.
- 1–4: Switch payment method only in an explicit shortcut context.

Do not intercept ordinary numeric typing as payment-method shortcuts. Do not override Khmer input composition, open menus, or unrelated browser behavior.

Display shortcut hints only when implemented.

## 12. Bottom help strip

Below the actions:
- Small keycaps and labels:
  Enter Confirm · Esc Cancel · F5 Reset · 1–4 Switch Method.
- Right shield/check icon and exchange-policy status.

The screenshot says “NBC Exchange Compliant”. Only display that exact claim if independently supported by the application’s verified policy. Otherwise use truthful wording such as “Configured exchange rate applied”.

## 13. Other payment methods

Preserve the four-card visual selector and implement method-specific content using existing integrations:

- Bakong/QR: real payment request, QR, expiry, status, and backend-confirmed settlement.
- Card: existing terminal/provider flow; do not collect raw card credentials in this modal.
- Split Tender: payment allocations that reconcile with the order balance.

Do not fabricate QR settlement, card approval, or successful payment. If an integration is missing, show a truthful unavailable state and report the dependency.

## 14. Currency accuracy

The screenshot is a visual reference, not an authoritative calculation.

At 4,100 KHR/USD:
- $5.40 converts to 22,140៛ before cash rounding.
- The screenshot displays 22,100៛.

Use the existing configured cash-rounding policy. If rounding produces 22,100៛, explicitly account for the 40៛ adjustment in the pricing/payment breakdown or existing audit model.

Reconcile:
- Cart grand total.
- Rounded payable amount.
- Combined tender.
- Change due.
- Mixed-currency change suggestions.
- Receipt and backend payment records.

Use decimal/integer money handling and established rounding utilities. Do not rely on binary floating-point arithmetic for financial calculations.

## 15. Responsive and accessible

- Keep the two-column layout on sufficiently wide screens.
- Stack order summary and payment entry on narrower screens.
- Allow method cards and quick-cash cards to wrap.
- Keep primary actions reachable without hiding content.
- Trap dialog focus and restore it on close.
- Provide accessible labels and selected states.
- Use visible keyboard focus.
- Support readable Khmer line heights.
- Keep touch targets comfortable.

## 16. Completion

Implement the modal fully, rather than returning only a plan.

Compare against the screenshot:
- Dark bilingual header.
- Gradient amount-due banner and yellow USD badge.
- Item table and totals.
- Tendered/change panel and suggested return.
- Receipt checkbox.
- Four method cards.
- Two currency inputs.
- Exact Cash and all quick-cash cards.
- Numeric keypad and increments.
- Cancel, Reset, Confirm, and shortcut footer.