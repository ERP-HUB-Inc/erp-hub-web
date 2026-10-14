Implement the attached “Quick Sale from Chat” interface in my existing application. Clicking the existing **Quick Sale (Chat Paste)** button on the Sales Orders page must open this interface.

Treat the screenshot as the visual reference. Reproduce every visible section, control, label, badge, icon, and layout relationship. Do not simplify the screen or omit sections.

### 1. Read the project rules first

- Locate and read the existing design system Markdown and relevant frontend/project instructions.
- Reuse the project’s UI components, typography, colors, spacing tokens, icons, forms, and modal patterns.
- Inspect the Sales Orders page, its existing Quick Sale button, order creation flow, customer lookup, inventory lookup, courier configuration, payment methods, and draft handling.
- Follow the screenshot’s composition while applying the existing design system.
- Implement the feature in the actual application, not as a separate demo.

### 2. Opening behavior and modal shell

- Wire the existing Quick Sale (Chat Paste) button to open this screen.
- Use a large modal matching the screenshot: rounded outer corners, dimmed backdrop, a thin green-to-light accent across the top, header, content area, and footer.
- On desktop, use approximately 95vw width with an appropriate maximum width and a maximum height that fits the viewport.
- Keep the header and footer visible while the content scrolls when necessary.
- Use two main columns: the chat input panel on the left, approximately 40%, and extracted order details on the right, approximately 60%.
- On smaller screens, stack the chat panel above the extracted details and keep all controls accessible.

### 3. Complete header

Include:

- Lightning icon inside a rounded tinted square.
- Title: **Quick Sale from Chat**.
- Badge: **AI Auto-Detect**.
- Badge: **v2.4 Multilingual**.
- Description:
  “Paste raw customer chat from Telegram, Messenger, TikTok, or WhatsApp. Automatic extraction of items, address, logistics, and phone.”
- A rounded platform selector containing:
  - Auto Detect, selected by default with a dark green background.
  - Telegram with its icon.
  - Messenger with its icon.
  - TikTok with its icon.
- Close button at the far right.

WhatsApp is mentioned in the description but has no separate tab in the screenshot. Preserve that arrangement. Platform selection must update the selected state and inform parsing where supported.

### 4. Left card: Paste Chat Message

Include every element:

- Clipboard icon and **Paste Chat Message** heading.
- **Paste from Clipboard** button with clipboard/paste icon.
- Large editable textarea with a soft tinted background and monospace chat text.
- Bottom-right character counter and language indicator, matching the screenshot’s “254 chars • Khmer/EN” treatment. Calculate the actual character count rather than hardcoding 254.
- Below the textarea, extraction indicator chips with check icons:
  - **2 Products**
  - **Phone No.**
  - **Location Geo**
  - **Time Constraint**
- Update these indicators according to the actual extraction result; do not show successful extraction before parsing.
- Informational card with a lightbulb/sparkle icon and this text:
  “Supports Khmer and English transcripts. Recognizes ABA transfer slips, phone variants (012 / +855), and local district landmarks.”
- Full-width **Re-parse Chat Content** button with sparkle icon.

Support Khmer and English input with fonts and line heights that do not clip Khmer characters.

Clipboard paste must work when browser access is available. If access fails, show a useful message and allow manual paste.

Keep the informational card visually present, but make its wording truthful to implemented capabilities. Do not claim geocoding or transfer-slip verification if these integrations are unavailable.

### 5. Right column: extraction banner

Create the full-width mint banner containing:

- Verification/seal icon.
- **Extracted Order Parameters** heading.
- Right-aligned green status dot and **100% Extracted & Verified** in the successful reference state.

For real use, display an accurate state such as Ready to Parse, Parsing, Needs Review, or Extracted & Verified. Do not invent a confidence percentage or claim verification merely because fields were detected.

### 6. Customer & Recipient card

Include:

- Uppercase **CUSTOMER & RECIPIENT** heading.
- Top-right badge: **New Customer (Auto-Create CRM)** for a customer confirmed to be new.
- Two adjacent tinted information panels.

Customer panel:

- Circular green initials avatar, “CV” in the reference.
- Customer name: **Chea Vibol**.
- Phone icon and **012 889 977**.
- Small **Cellcard** badge.

Address panel:

- Location icon inside a tinted rounded square.
- **Toul Kork District**.
- **Zone 1** badge.
- Address preview: **House #42, St 315, Sangkat…**

Use extracted and existing customer data in production. Preserve phone numbers as strings with leading zeros. Only display carrier or delivery zone when supported by reliable data.

Allow the user to review and correct the customer name, phone, and complete address without disrupting the default screenshot layout, for example through an edit interaction.

Look up existing customers using the existing application flow. Do not create a customer during parsing. Create or link the customer at save time through existing rules, preventing accidental duplicates.

### 7. Matched Inventory SKU Items card

Include:

- Uppercase **MATCHED INVENTORY SKU ITEMS** heading.
- Mint **2 Lines Match** badge, calculated from actual matched lines.
- Right-aligned **+ Add Item** action.
- Product rows with:
  - Product icon or existing product image inside a tinted rounded square.
  - Product name.
  - SKU label and value.
  - Separator dot.
  - Green stock availability text.
  - Quantity stepper with minus, quantity, and plus.
  - Right-aligned line total.
  - Smaller unit price below the line total.
- Subtle divider between rows.

Reference products:

1. **XS Max Logic Board**
   - SKU: **000476**
   - **In Stock (15 Pcs)**
   - Quantity: **2**
   - Unit price: **$8.00 ea**
   - Line total: **$16.00**
   - Chip/processor icon.

2. **IRVINS Salted Egg 105g**
   - SKU: **885015022115**
   - **In Stock (95 Pcs)**
   - Quantity: **1**
   - Unit price: **$1.00 ea**
   - Line total: **$1.00**
   - Food icon.

Match extracted items against real inventory. Flag unmatched or ambiguous products for user selection. Do not silently select an uncertain match.

The Add Item action must use the existing product selection flow. Quantity controls must update totals and follow existing quantity and stock rules. Preserve an existing item removal mechanism or provide it within the item edit interaction without changing the reference layout unnecessarily.

### 8. Delivery & Courier card

Position this below the inventory card on the left side of the right column.

Include:

- Uppercase **DELIVERY & COURIER** heading.
- Tinted courier row with delivery icon, **Grab Express**, and right-aligned **$1.50**.
- Light red dispatch-note panel with clock icon:
  **Dispatch Note: Deliver today before 4:00 PM**

Use existing courier options and fee rules. Allow courier, fee where permitted, and dispatch note to be reviewed or edited.

Extract delivery constraints from chat. Interpret “today” using the application’s configured business timezone. Preserve the original wording when the date or time cannot be resolved confidently.

### 9. Payment & Totals card

Position this alongside Delivery & Courier.

Include:

- Uppercase **PAYMENT & TOTALS** heading.
- **Subtotal (3 items)** — **$17.00**.
- **Delivery Fee** — **$1.50**.
- Mint total section containing:
  - **Total Payable**.
  - **≈ 75,850 KHR (COD)** underneath.
  - Large dark green **$18.50** aligned right.

Distinguish product lines from unit count: the reference contains two product lines and three units.

Recalculate totals whenever quantity, items, prices, or delivery fee change. Use existing money calculation utilities.

Use the configured USD/KHR exchange rate; do not hardcode the screenshot conversion in production. Display the extracted payment method and allow correction through a compact existing interaction.

COD is a payment method and must not automatically mark the order as paid.

### 10. Complete footer

Include:

- Checked checkbox on the left.
- Printer icon.
- Label:
  **Auto-generate & print shipping waybill after order save**
- Right-aligned buttons:
  - **Cancel**
  - **Save as Draft**
  - Dark green **Create & Confirm Order**
- Include the right-arrow and return/enter-key glyph shown inside the primary button.

Behaviors:

- Cancel and Close use the existing modal dismissal pattern and protect unsaved edits where applicable.
- Save as Draft uses the existing draft order flow.
- Create & Confirm Order validates required fields and uses the existing order creation/confirmation flow.
- Prevent duplicate submissions and display loading states.
- Retain entered data after a failed save.
- Generate and print the shipping waybill only after a successful order save and only when the checkbox is selected.
- A printing failure must not cause the saved order to be submitted again.
- If a keyboard shortcut is implemented, show its accurate hint and do not let ordinary Enter in the textarea submit the order.

### 11. Parsing and real data

Use the existing chat extraction service if available. Inspect the project before introducing a new dependency.

Extract or map:

- Customer/recipient name.
- Phone number.
- Delivery address.
- Product names, quantities, and stated prices.
- Payment method.
- Courier.
- Delivery time constraint or dispatch note.

Treat chat content as untrusted input. Render it safely and require user review before saving.

Preserve user corrections during re-parsing, or explicitly show proposed replacements for review. Do not silently overwrite manual edits.

If an integration is missing, implement the complete UI and available behavior, isolate the missing integration behind the project’s service pattern, and clearly report the remaining dependency. Do not fake successful parsing, CRM creation, inventory verification, or printing.

### 12. Reference fixture for visual verification

Use this chat only in a development fixture or preview to reproduce the screenshot. Keep the normal production opening state empty unless the existing flow supplies text.

Hi admin, I want to buy:
- 2x XS Max Logic Board ($8 each)
- 1x IRVINS Salted Egg 105g ($1.00)

Deliver to: House #42, St 315, Sangkat Toul Kork, Phnom Penh.
Recipient: Chea Vibol
Tel: 012 889 977
Payment: COD (Cash on Delivery)
Please send with Grab express today before 4 PM!

The fixture should reproduce the displayed customer, two product lines, three units, courier, dispatch note, and totals.

### 13. Completion checks

- Compare the implemented modal against the attached screenshot section by section.
- Verify that no visible section, badge, control, footer action, or informational panel was omitted.
- Verify desktop layout and small-screen scrolling.
- Verify button opening, platform selection, clipboard paste, manual input, parsing, correction, item matching, quantity changes, Add Item, totals, draft save, confirmation, and conditional printing.
- Run the project’s appropriate lint/type checks and relevant existing tests.
- Report changed files, completed behavior, verification results, and any missing integration.

Complete the implementation rather than stopping at a plan.