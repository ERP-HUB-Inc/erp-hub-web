Enhance ONLY the bottom section of my existing POS right sidebar.

Use the provided screenshot as the exact visual reference.

CRITICAL:
Do NOT redesign the whole POS.
Do NOT modify the header.
Do NOT modify the category tabs.
Do NOT modify the product grid.
Do NOT modify the cart item list layout above.
Do NOT modify the payment screen flow.
Do NOT change existing functionality.

This task is ONLY for the bottom section of the Current Order sidebar, starting from the order summary area down to the Pay button.

==================================================
TARGET SCOPE
==================================================

Only enhance these sections:

1. Order Summary
   - Subtotal
   - Discount
   - Tax
   - Total Due
   - Exchange rate
   - Secondary currency amount

2. Bottom Action Buttons
   - Hold Sale
   - More Options

3. Main Payment Button
   - Pay $22.85 (End)
   - Enter shortcut badge

Do not modify the product/cart list above this section.

==================================================
1. FOLLOW THE SCREENSHOT EXACTLY
==================================================

Use the screenshot as the target UI.

The lower section should visually match this structure:

--------------------------------
Subtotal                 $23.00
Discount     [+ Add]    -$0.15
Tax (Included 0%)        $0.00

--------------------------------

Total Due                 93,685៛
Rate: 1$ = 4,100៛        $22.85

--------------------------------

[ Hold Sale    F6 ]   [ More Options ]

[ Pay $22.85 (End)      Enter ↵ ]
--------------------------------

Keep the same placement, spacing, and hierarchy as the screenshot.

==================================================
2. ORDER SUMMARY SECTION
==================================================

Keep the order summary as a clean flat section, not a heavy card.

Show these rows in this order:

- Subtotal
- Discount
- Tax (Included 0%)

Then a divider line.

Then the Total Due section.

Rules:
- Left side = label
- Right side = value
- Keep rows aligned and easy to scan
- Use compact but readable spacing
- Use subtle section separation

Typography:
- labels = dark gray / semibold
- helper text = muted gray
- values = darker and slightly stronger
- negative discount = green
- total due = strongest emphasis

==================================================
3. DISCOUNT ROW
==================================================

Keep the discount row exactly like the screenshot.

Structure:
Discount   [+ Add]    -$0.15

Requirements:
- label on left
- small rounded "+ Add" pill beside the label
- discount amount aligned right
- negative amount shown in green

Do not redesign this into a dropdown or a full input area.

Preserve the current discount functionality and event handler.

==================================================
4. TAX ROW
==================================================

Display:
Tax (Included 0%)      $0.00

Requirements:
- keep it simple and compact
- use muted label styling
- value aligned right
- preserve existing tax logic

Do not change tax behavior or calculations.

==================================================
5. DIVIDER
==================================================

Use a subtle divider between:

summary rows

and

Total Due section

Style:
- thin light-gray or dashed divider
- minimal visual weight
- exactly like a clean POS summary separation

==================================================
6. TOTAL DUE SECTION
==================================================

This is the most important area of the bottom summary.

Follow the screenshot hierarchy:

LEFT:
Total Due
Rate: 1$ = 4,100៛

RIGHT:
93,685៛
$22.85

Visual rules:
- "Total Due" should be bold and prominent
- exchange rate text should be smaller and muted
- KHR amount should be shown above as secondary highlighted amount
- USD amount should be the largest and most visually dominant
- final amount should be bold and large

Do not place Total Due inside a separate popup or card.
Keep it inside the order summary footer area.

Preserve all current logic for:
- subtotal
- discount
- tax
- exchange rate
- USD total
- KHR converted total

==================================================
7. BOTTOM ACTION BUTTONS
==================================================

Keep exactly two secondary buttons above the Pay button:

LEFT:
Hold Sale

RIGHT:
More Options

Style both like the screenshot:
- medium-large rounded buttons
- white/light background
- subtle border
- soft shadow only if needed
- equal height
- aligned side-by-side

Hold Sale button:
- include shortcut badge "F6"
- shortcut badge should be a small muted pill
- preserve current Hold Sale functionality

More Options button:
- include leading ellipsis icon/text style similar to screenshot
- preserve current functionality or dropdown trigger

Do not stack them vertically.
Do not make them primary-colored buttons.

==================================================
8. PAY BUTTON
==================================================

The Pay button should remain the strongest action in this section.

Match the screenshot closely:

[ ✔ Pay $22.85 (End)      Enter ↵ ]

Requirements:
- full-width large primary button
- teal / green background
- white text
- rounded corners
- strong visual emphasis
- left icon/checkmark
- payment amount included in button label
- "(End)" kept in label
- shortcut badge "Enter ↵" shown on the right inside the button

Visual hierarchy:
- main action text large and bold
- keyboard shortcut in a lighter small pill area
- button should feel very clickable and POS-friendly

Preserve:
- existing Pay button handler
- existing payment screen navigation
- existing validation/business logic

Do NOT redesign the payment flow.
Do NOT replace what happens after clicking Pay.

==================================================
9. SPACING AND ALIGNMENT
==================================================

Polish the spacing to match the screenshot:

- enough space between cart list and summary
- summary rows evenly spaced
- clear separation before Total Due
- good breathing room before action buttons
- comfortable spacing between Hold Sale / More Options and Pay button

Use a clean spacing rhythm such as:
- 12px
- 16px
- 20px
- 24px

Do not make it cramped.
Do not make it overly tall.

==================================================
10. VISUAL STYLE
==================================================

Match the reference style closely:

- very light neutral background
- white or near-white section surfaces
- subtle borders
- teal primary accent
- green for positive/discount/payment highlights
- muted gray helper text
- dark navy/gray main text
- rounded corners
- soft modern POS style

Avoid:
- gradients
- glassmorphism
- heavy drop shadows
- overly colorful UI
- thick borders
- oversized decorative icons

==================================================
11. FUNCTIONAL PRESERVATION
==================================================

This is mandatory.

Do not break:
- subtotal calculation
- discount calculation
- tax calculation
- currency conversion
- total due calculation
- Hold Sale action
- More Options action
- Pay button action
- keyboard shortcut display or behavior if already implemented
- payment screen entry flow

Reuse the existing:
- state
- props
- event handlers
- API calls
- business logic

This task is visual enhancement only.

==================================================
12. DO NOT TOUCH UPPER ORDER LIST
==================================================

Do not change:
- Current Order title
- item count badge
- customer box
- Held Orders / Recent Orders buttons above
- item list layout
- quantity controls
- item discount links
- trash icons

Those sections are outside the scope of this request.

==================================================
13. FINAL EXPECTATION
==================================================

The result should look like:

"Apply the provided screenshot styling ONLY to the bottom summary and payment action area of my Current Order sidebar."

NOT:

"Redesign the entire POS sidebar."

Preserve the existing functionality while improving:
- order summary clarity
- total due emphasis
- bottom action button styling
- pay button hierarchy
- spacing and polish