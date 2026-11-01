Enhance my existing POS **Add New Customer** form to match the attached screenshot precisely. Implement it as a modal connected to the customer panel’s **+ Add** action.

Read DESIGN.md and applicable frontend instructions first. Reuse existing modal, form, validation, API, and customer-assignment logic.

## 1. Modal layout

- Approximately 444px wide on desktop, constrained to the viewport on mobile.
- White background.
- Approximately 16px rounded corners.
- Subtle shadow over a dimmed backdrop.
- Thin teal accent strip along the top edge, clipped to the rounded corners.
- Three sections: header, form body, pale footer.
- Approximately 24px horizontal padding.
- Compact spacing matching the screenshot.
- Preserve the surrounding POS layout.

## 2. Header

Left:
- Pale mint rounded-square icon tile, approximately 40×40px.
- Teal user-plus outline icon.
- Title: **Add New Customer**, dark navy, approximately 16px semibold.
- Subtitle: “Create customer profile for loyalty & order history”, approximately 12px muted slate.

Right:
- Small muted X close button.
- Accessible label: “Close new customer form”.

Separate the header from the body with a thin pale border.

## 3. Phone Number

Label row:
- Left: **Phone Number** with red required asterisk.
- Right muted hint: **e.g. 012 / 096 / +855**.

Input:
- Approximately 38–40px high.
- Thin pale blue-gray border.
- Approximately 12px radius.
- Left prefix segment with Cambodian flag and **+855**.
- Subtle divider after the prefix.
- Main placeholder: **012 345 678**.
- Muted phone outline icon on the right.
- Use tabular numerals where appropriate.

Behavior:
- Use type="tel", suitable autocomplete, and mobile keyboard support.
- Accept supported local and international Cambodian formats.
- Normalize through existing phone utilities before submission.
- Avoid duplicating +855 or retaining a redundant domestic leading zero in the canonical value.
- Preserve the user’s input while editing.
- Validate frontend and backend consistently.
- If the number already exists, show a useful message and an authorized option to select the existing customer; do not silently create a duplicate.

The prefix is fixed unless the existing application supports country selection.

## 4. Customer Name

Label row:
- Left: **Customer Name**.
- Right: muted **Optional**.

Input:
- Same height, border, and radius as the phone field.
- Placeholder: **e.g. Sok Sovan, Miss Bopha**.
- Small muted ID-card/contact icon on the right.

Help text:
“If empty, defaults to Guest (Phone #).”

Use the existing guest-name convention. Apply the fallback after successful phone normalization and follow existing phone-masking rules wherever the name is displayed.

Support Khmer and English names. Do not make this field required.

## 5. Date of Birth panel

Create a pale gray-blue rounded panel with a thin subtle border and approximately 12px padding.

Header:
- Teal birthday/cake icon.
- Label: **Date of Birth**.
- Right outlined mint pill: **Day & Month only**.

Description:
“Day & Month only for privacy safe birthday rewards (no year required).”

Below:
- Two equal-width selects with approximately 10px gap.
- Small uppercase labels: **DAY** and **MONTH**.
- White controls, subtle borders, approximately 8px radius.
- Right-aligned muted chevrons.

Reference selections:
- Day: 15.
- Month: 10 - October.

Behavior:
- This is optional.
- Start with unselected placeholders unless editing an existing customer; do not prefill the screenshot’s birthday.
- Store month and day without inventing a birth year.
- Validate valid month/day combinations, including February 29 under the application’s birthday policy.
- If one value is entered, require the other or allow clearing both.
- Use existing backend support or extend the customer model appropriately; do not fabricate a year to fit a full-date field.
- Do not claim birthday rewards are active unless that feature exists.

## 6. Customer Group

Label: **Customer Group**.

Display four equal-width selectable buttons in one row:
- Walk-in.
- Regular.
- VIP.
- Wholesale.

Style:
- Approximately 30–32px high.
- Approximately 8px radius.
- Small centered labels.
- Approximately 8px gaps.

Selected Walk-in:
- Solid teal background.
- White semibold text.

Unselected:
- White background.
- Thin pale border.
- Dark slate text.

Make the entire button clickable. Use accessible single-choice semantics, keyboard navigation, and visible focus.

Populate actual supported groups and preserve stable IDs. Use Walk-in as the default only when consistent with existing rules. Do not grant pricing privileges or discounts solely through a decorative frontend selection.

## 7. Footer

- Pale gray-blue background.
- Thin top divider.
- Approximately 16px vertical padding.
- Actions aligned horizontally.

Left:
**Cancel (Esc)**
- Text-style button.
- Muted dark slate.

Right:
**Save & Assign to Order (Enter)**
- Teal filled button.
- White user-check/user-plus icon.
- White semibold text.
- Approximately 34–36px high.
- Approximately 12px radius.
- Subtle shadow.

Behavior:
- Cancel, close, and Escape dismiss without changing the order’s customer.
- Save validates, creates the customer through the real API, then assigns the returned customer to the current order.
- Close only after the required operation succeeds.
- Prevent duplicate submissions and show saving state.
- Preserve values after errors and display useful inline/API messages.
- If creation succeeds but assignment fails, retain the created customer ID and retry assignment without creating another customer.

Enter should submit only when appropriate. Do not submit during Khmer input composition or while a select menu is handling the key. Show shortcut hints only when implemented.

## 8. Integration and accessibility

- Reuse existing customer creation permissions and tenant boundaries.
- Focus the phone field when opening.
- Trap focus inside the dialog and restore it to + Add when closing.
- Associate labels, descriptions, and errors with their controls.
- Give icon-only controls accessible labels.
- Use appropriate Khmer font fallbacks.
- Keep the modal usable on small screens with a scrollable body if needed.
- Keep all fields within the viewport without horizontal overflow.

## 9. Verification

Match the screenshot’s:
- Teal top strip.
- Header icon, title, subtitle, and close button.
- Phone prefix segment and trailing icon.
- Optional name field and help text.
- Birthday panel, badge, and two selects.
- Four group buttons.
- Pale footer and both actions.