Enhance my existing POS customer search/selection UI to match the attached screenshot precisely, using a right-side drawer.

Read DESIGN.md and applicable frontend instructions first. Reuse existing customer APIs, loyalty data, permissions, query patterns, and order-assignment logic.

Preserve the existing POS screen and customer panel.

## 1. Drawer structure

- Open from the right over a dimmed backdrop.
- Approximately 440px wide on desktop.
- Full viewport width on small screens.
- Full available viewport height.
- White/pale gray-blue surfaces.
- Rounded left corners where consistent with the existing drawer.
- Fixed header, search/filter area, scrollable results, and bottom action footer.
- No horizontal overflow.

Match the screenshot’s compact typography, spacing, borders, mint highlights, and rounded cards.

Use the existing application font and Khmer fallback.

## 2. Header

Left:
- Pale mint rounded-square tile with teal user-search icon.
- Title: **Select Customer**, approximately 16px semibold, dark navy.
- Subtitle:
  “Search loyalty members or assign walk-in guest”
- Subtitle uses approximately 12px muted slate text and may wrap onto two lines.

Right:
- Compact teal **New** button with user-plus icon.
- Small **F3** shortcut badge inside the button.
- Muted X close button.

New opens the existing Add New Customer modal.
- Preserve drawer search/filter state while that modal is open.
- On cancellation, return to the drawer.
- On successful Save & Assign, update the order and close the selection flow appropriately.
- Implement F3 only while this drawer is active and without interfering with input composition.

## 3. Search field

Full-width rounded white input:
- Thin pale blue-gray border.
- Approximately 38px height.
- Search icon on the left.
- Search text inside.
- Clear-circle button on the right.
- Compact Cmd+K / Ctrl+K hint at the far right when implemented.

Search by supported fields:
- Customer name.
- Phone number.
- Customer/member code where available.

Behavior:
- Debounce server requests using existing conventions.
- Normalize phone search appropriately.
- Keep the typed query visible.
- Clear resets search.
- Prevent stale responses from replacing newer results.
- Provide loading and retry states.

Reference query: **012**. Do not prefill this in production.

## 4. Filter chips

Below search, display:
- **All (148)**.
- **Recent (5)** with a small amber dot.
- **VIP Members**.
- **Wholesale**.

Selected All:
- Solid teal background.
- White text.

Unselected:
- White background.
- Thin pale border.
- Dark slate text.

Use compact pill shapes and approximately 6px gaps.

Populate actual counts. Define Recent using existing customer/order history policy. Filters affect the results query rather than merely changing chip styling.

Allow horizontal scrolling or clean wrapping on narrow screens.

## 5. Default walk-in card

Show a separate card above search results:
- White background.
- Thin pale border.
- Approximately 14px radius.
- Pale circular user avatar on the left.
- Bold **Walk-in Customer (Default)**.
- Small neutral **Active** badge when accurate.
- Supporting text:
  “Default guest checkout · 0 loyalty points”.
- Right-side pale button: **Keep Default**.

Use actual default-customer configuration and supported loyalty semantics. Do not imply that a shared guest account owns a personal points balance.

Keep Default explicitly assigns/retains the default walk-in customer and closes the drawer on success.

If another customer is currently assigned, use an accurate label such as “Use Default” while preserving the same styling.

## 6. Results heading

Left:
**SEARCH RESULTS MATCHING "012"**
- Small uppercase muted blue-gray text.
- Adapt to the actual query.
- Without a query, use an appropriate customer-list heading.

Right:
**5 accounts found**
- Compact teal text.
- Use actual matching count.

The screenshot shows three visible example cards despite a count of five. Render all returned results through scrolling/pagination; do not hide available results to copy this mismatch.

## 7. Highlighted customer card

Match the first card’s appearance:
- White background.
- Strong pale teal border.
- Approximately 14px radius.
- Approximately 14px padding.
- Clearly highlighted relative to other results.

Top row:
- Circular mint avatar with initials, such as SM.
- Bold customer/business name.
- Small pale amber **VIP Tier 2** badge beneath or beside the name.
- Right teal **✓ Select** button.

Reference customer:
**Sokha Property Management**

Below:
- Phone number with matching query fragments highlighted in pale mint.
- Use monospace/tabular numerals for phone values.
- Secondary contact name:
  **Channarith Meng**.

Highlight search matches through safe text rendering, not unsanitized HTML.

### Loyalty summary panel

Pale gray-blue inset panel with two columns:

Left:
- Small label: **Loyalty Balance**.
- Bold teal value: **420 pts ($4.20 credit)**.

Right:
- Small label: **Last Checkout**.
- Value: **Yesterday · $45.00**.

Use actual loyalty balances, redemption rules, currency, and last-checkout data. Do not assume a fixed points-to-money conversion.

### Bottom row

Left:
- Small relevant icon.
- Teal text:
  **Eligible for 5% Corporate Discount**.

Right:
- Muted text:
  **Total Visits: 38**.

Show only supported eligibility and visit data. Selecting a customer must follow existing pricing/discount rules rather than blindly applying the displayed percentage.

## 8. Standard customer card with birthday insight

White rounded card with subtle border.

Top:
- Circular neutral initials avatar.
- Bold name: **Sophanna Morn**.
- Small neutral **Regular** badge.
- Right pale **Select** button.

Secondary line:
- Phone number.
- Separator.
- Teal loyalty points, such as **180 points**.

Below:
- Pale pink birthday banner.
- Birthday/cake icon.
- Dark pink text:
  **Birthday in 4 days (Oct 28)**.
- Right small pink badge:
  **10% Promo Gift**.

Use actual birthday month/day and business timezone, including year rollover and leap-day policy. Do not hardcode reference dates.

Show a promotion only when configured and eligible. Clearly distinguish available rewards from already redeemed rewards where relevant.

## 9. Compact customer card

White rounded card with subtle border.

- Pale blue initials avatar.
- Bold name:
  **Sokha Real Estate Co.**
- Small blue **Wholesale** badge.
- Right pale **Select** button.
- Secondary line:
  - Phone number with query-match highlight.
  - Separator.
  - **Commercial Tier**.

Do not reserve blank loyalty/birthday panels when those details are unavailable or irrelevant.

Build one reusable result-card component with conditional detail sections rather than separate hardcoded components for the screenshot accounts.

## 10. Selection and highlighting

Maintain a clear distinction between:
- Customer currently assigned to the order.
- Customer highlighted for keyboard navigation.
- Customer being submitted for assignment.

Behavior:
- Clicking a card highlights it without accidentally submitting.
- Clicking its Select button assigns that customer through the existing flow.
- **Assign Highlighted** assigns the highlighted customer.
- Preserve the existing order customer until assignment succeeds.
- Show pending state and prevent duplicate submission.
- On failure, keep the drawer and search state open with a useful error.
- Close after successful assignment and refresh the customer panel.

Do not nest buttons inside another button. Use appropriate card structure and accessible controls.

## 11. Footer

Fixed at the drawer bottom with white background and a thin top border.

First row:
- Left teal dot and:
  **Showing 5 matching customers**.
- Right muted:
  **Registry v3.2**.

Use actual counts. Show a registry version only if the application has a meaningful source for it; otherwise omit the version label.

Action row:
- Left wide pale gray button: **Cancel**.
- Right wider teal button:
  - Customer/assignment icon.
  - **Assign Highlighted**.
  - Compact **Enter** shortcut badge.

Disable Assign Highlighted when no valid customer is highlighted.

Bottom keyboard-help strip:
- Pale gray-blue background.
- Small keycaps:
  - ↑ ↓ Navigate.
  - Enter Confirm.
  - Esc Close.

Keyboard behavior:
- Arrow keys navigate results when appropriate.
- Enter confirms the highlighted customer.
- Escape closes the active overlay.
- Do not override text editing, open menus, or Khmer input composition.
- Scroll the highlighted result into view.
- Display shortcut hints only when implemented.

## 12. Data, states, and accessibility

- Query only authorized tenant/customer data.
- Respect permission and privacy rules for contact, loyalty, and transaction details.
- Avoid one API request per result card.
- Use existing pagination or load-more behavior for large result sets.
- Provide initial loading, searching, no customers, no matches, and retryable error states.
- Keep unavailable loyalty data distinct from confirmed zero.
- Trap focus in the drawer and restore it to the POS Change button on close.
- Give clear and close icons accessible labels.
- Use visible focus and text alongside color indicators.
- Keep results scrollable without scrolling the underlying POS page.

## 13. Verification

Match the screenshot’s:
- Header, New button, and close control.
- Search field, clear button, and shortcut hint.
- Four filter chips.
- Default walk-in card.
- Results heading and count.
- Highlighted detailed loyalty card.
- Birthday insight card.
- Compact wholesale card.
- Footer count, actions, and keyboard-help strip.