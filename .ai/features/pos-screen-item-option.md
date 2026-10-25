Enhance my existing MarketChain POS item-selection modal to match the attached screenshot.

Read DESIGN.md, frontend rules, and applicable project instructions first. Inspect the existing POS cart, product variants, modifiers, pricing, and location-stock logic. Reuse existing components, icons, design tokens, and services.

Implement the modal in the existing add-to-order flow.

### 1. Layout and design

- Large centered white modal with rounded corners and a dimmed backdrop.
- Clear sections separated by generous spacing.
- Header, scrollable options area, quantity/price summary, and bottom action bar.
- Follow sizes, typography, spacing, and colors from DESIGN.md.
- Use teal for selected options and the primary action, navy for headings, muted blue-gray for secondary text, and amber for low stock.
- Selected tiles use a teal border and very pale mint background.
- Unselected tiles use a subtle neutral border.
- Avoid layout movement when selection borders change.
- Reuse Lucide icons if already installed.
- Support Khmer and English with suitable fonts and line heights.

Treat the screenshot as a visual reference. Adapt its scale to the application rather than copying image pixels directly.

### 2. Product header

Display:

- Product image or colored initials fallback on the left.
- Product name in bold.
- Stock-status pill beside the name.
- Secondary line containing category, product group, and SKU.
- Close button aligned to the top right.

Reference product:
- IRVINS Salted Egg 105g.
- Snacks · FMCG.
- SKU: 885015022115-STD.
- In Stock.

Use actual product information. Update the displayed SKU, price, and stock status when the selected sellable variant changes.

Handle long product names without overlapping the status or close button.

### 3. Flavor / Recipe

Display a numbered heading:

“1. FLAVOR / RECIPE”

Show “Required” on the right when configured as required.

Create three reference radio-style option tiles:

- Original Salted Egg — Classic recipe.
- Hot Boom Spicy — Chili infused.
- Black Truffle — Aromatic gourmet.

Each tile contains a bold title and smaller description.

Selected state:
- Teal border.
- Pale mint background.
- Circular teal check indicator on the right.

Use actual configured options. Select an initial value only when an existing default or unambiguous variant supports it.

Do not hardcode flavors for products that do not have this option group.

### 4. Packaging Size & Net Weight

Heading:

“2. PACKAGING SIZE & NET WEIGHT”

Show “Select One” on the right.

Reference tiles:

- Small Pouch:
  - 50g.
  - $0.50.
  - Qty: 42.
- Standard:
  - 105g.
  - Popular badge.
  - $0.85.
  - Qty: 95.
- Family Pack:
  - 230g.
  - $1.80.
  - Low: 4.

Tile layout:
- Packaging name at top left.
- Weight at top right.
- Price at bottom left.
- Available quantity or low-stock indicator at bottom right.

The selected Standard tile uses teal border, mint background, and teal price.

Behavior:
- Resolve flavor and packaging selections to an actual sellable variant.
- Support sparse combinations; do not assume every flavor exists in every size.
- Disable unavailable combinations with an understandable reason.
- Derive stock from the active POS location and existing availability policy.
- Respect existing overselling, backorder, and stock-tracking rules.
- Use configured low-stock thresholds.
- Show “Popular” only when supported by configured metadata or actual ranking.
- Preserve units of measure and existing packaging conversions.

### 5. Optional Add-ons & Notes

Heading:

“3. OPTIONAL ADD-ONS & NOTES”

Show rounded outlined toggle chips with a plus icon:

- Extra Napkins.
- Gift Carrier Bag.
- Plastic Cutlery.

Use actual configured modifiers rather than adding these examples to every product.

Selected chips should have an obvious selected state and expose their state accessibly.

- Show additional prices when modifiers cost extra.
- Respect modifier selection limits and availability.
- Apply existing modifier stock rules where relevant.
- Keep variant attributes separate from optional modifiers.

If item notes are supported, provide a compact “Add note” control that reveals a labeled textarea. Preserve notes on the cart line. Do not introduce a nonfunctional note field.

Hide option sections that do not apply and number visible sections consistently.

### 6. Quantity and price summary

Create a pale tinted summary strip above the action footer.

Left:
- “Quantity:”
- Rounded quantity control with minus, value, and plus.

Right:
- Muted “Unit Price: $0.85”.
- Prominent “Total: $0.85”.

Behavior:
- Default quantity follows existing POS rules.
- Support direct quantity entry with validation.
- Use the product’s allowed quantity precision and increments.
- Prevent zero, negative, malformed, or unavailable quantities according to policy.
- Disable decrement at the minimum.
- Update totals immediately when quantity, variant, or add-ons change.
- Use existing money utilities and decimal handling.

Calculate pricing using the existing POS pricing engine, including applicable price lists, discounts, modifiers, and tax rules. Make clear whether displayed prices include tax. Do not introduce a competing calculation.

### 7. Bottom actions

Right-aligned actions:

1. Outlined “Cancel” button with an Esc keyboard hint.
2. Large teal primary button:
   “+ Add to Order • $0.85”
   with an Enter keyboard hint.

Use the current calculated total in the primary button.

Behavior:
- Cancel, close, and Escape dismiss without changing the cart.
- Add to Order validates required selections, variant availability, quantity, and price.
- Use the existing cart action.
- Prevent duplicate additions from repeated clicks or key presses.
- Close after a successful cart addition and return focus appropriately.
- Preserve selections after recoverable errors.
- Show pending and error states using existing patterns.
- If price or availability changes, follow the existing POS revalidation flow.

Enter should submit only when appropriate. It must not submit while typing multiline notes, composing Khmer text, or interacting with another control.

Display keyboard hints only when their behavior is implemented.

### 8. Cart integration

Preserve on the cart line:

- Product and variant identifiers.
- Selected option labels.
- Modifier identifiers and quantities.
- Item notes.
- Quantity and unit of measure.
- Existing price, discount, and tax metadata.

Follow existing cart-line merge rules. Different variants, modifiers, or notes must not merge in a way that loses customization.

If this modal supports editing an existing line, restore its selections and use an “Update Item” action that updates the intended line.

### 9. Responsive layout and accessibility

- Three option columns on wide screens.
- Two columns where practical and one on narrow screens.
- Keep the modal within the viewport.
- Scroll the option area while keeping the summary and actions reachable.
- Allow footer content to wrap cleanly on mobile.
- Provide comfortable touch targets.
- Use accessible dialog semantics, focus trapping, and focus restoration.
- Implement single-choice groups with radio semantics and keyboard navigation.
- Give icon buttons accessible names.
- Communicate selection, errors, and stock status through text as well as color.

### Selectable option-value cards

Render each product option group as a section, with **each individual option value displayed inside its own clickable selection card**, matching the screenshot.

Use the product’s actual configured option groups and values. For example:
- Flavor: Original Salted Egg, Hot Boom Spicy, Black Truffle.
- Size: Small Pouch, Standard, Family Pack.
- Color, when configured: individual cards with a color swatch and readable color name.

Do not hardcode the modal to Flavor and Packaging only. Generate sections dynamically from existing product option definitions, preserving their configured order.

**Entire-card interaction**
- Make the entire card clickable/tappable, including its label, description, price, and empty space.
- For a single-choice group, clicking a card selects that value and deselects the previous value within the same group.
- Keep selections in other groups unless the new value makes them incompatible.
- Use radio semantics for single selection and checkbox semantics for multiple selection.
- Support keyboard selection and visible focus.

**Unselected card**
- White background.
- Thin pale blue-gray border.
- Rounded corners consistent with DESIGN.md.
- Bold option-value label.
- Muted description or supporting metadata.
- Subtle hover background/border.

**Selected card**
- Pale mint background.
- Strong teal border, approximately 2px.
- Teal circular indicator with a white checkmark.
- Preserve the card’s dimensions when its border changes.
- Keep the selection visible after the pointer leaves the card.

**Card content**
- Simple attribute values: label and optional description.
- Packaging/variant values: label, weight or size, applicable price, and location stock.
- Color values: swatch plus text; never communicate the selection through color alone.
- Show a “Popular” badge only when backed by actual metadata.
- Display price and stock only when they can be resolved accurately for the current selection. Do not assign a final variant’s stock or price to an ambiguous attribute value.

**Unavailable values**
- Visually mute unavailable cards and show the reason, such as “Unavailable combination” or “Out of stock”.
- Apply existing overselling policy when deciding whether stock prevents selection.
- Do not silently switch another selected value.
- If a selection becomes invalid, clearly identify the group requiring reselection and disable Add to Order until resolved.

**Selection result**
- Resolve the selected option-value combination to the actual variant ID/SKU.
- Update the header SKU, availability, unit price, total, and Add to Order amount.
- Require all mandatory groups before adding.
- Preserve selected option-value IDs and labels on the cart line using the existing cart model.

Match the screenshot’s three-card rows on desktop, wrapping into two or one column as space requires. Keep cards within each group consistent in height and align their content.

### 10. Scope and verification

Preserve the surrounding POS screen, cart, checkout, branch/terminal/shift context, and existing authorization.

Use screenshot values only as development fixtures. Do not fabricate product options, stock, pricing, or successful cart actions.

Verify:
- Visual alignment with the screenshot.
- Khmer rendering and long labels.
- Products with no options, one option group, and multiple variant groups.
- Unavailable combinations and low/out-of-stock states.
- Paid add-ons, notes, quantity changes, and accurate totals.
- Adding and editing cart lines.
- Keyboard, touch, loading, and error behavior.

Run appropriate lint/type checks and relevant existing tests. Report changed files, verification results, and any missing backend fields or integrations.