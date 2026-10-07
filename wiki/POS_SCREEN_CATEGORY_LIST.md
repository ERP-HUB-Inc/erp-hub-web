Enhance ONLY the category listing section of my existing MarketChain POS screen.

Use the provided screenshot as the exact visual reference.

CRITICAL:
Do NOT redesign the whole POS.
Do NOT modify the top header.
Do NOT modify the product grid.
Do NOT modify the current order sidebar.
Do NOT modify the payment flow.
Do NOT change any existing functionality.

This task is ONLY for the horizontal category listing area on the POS screen.

==================================================
TARGET SCOPE
==================================================

Only enhance the category listing row that contains category cards such as:

- All Menus
- Accessories - Updated
- Age Rejuvenating
- AIR CONDITIONER
- All-in-One Desktop
- AN...

This section should visually match the screenshot as closely as possible.

==================================================
1. FOLLOW THE SCREENSHOT EXACTLY
==================================================

Use the screenshot as the target UI.

The category section should remain:

- a single horizontal row
- large rounded category cards
- compact spacing between cards
- clean white card surfaces
- subtle borders
- soft shadow or elevation only if needed
- horizontally scrollable if categories overflow

Do not convert this into:
- plain text tabs
- a dropdown
- a sidebar
- a compact chip list
- large content panels

It must remain a clean POS category selector row.

==================================================
2. CATEGORY CARD STRUCTURE
==================================================

Each category item should be a rounded rectangular card similar to the screenshot.

Each category card contains:

LEFT:
- icon area or colored circular/square badge

RIGHT:
- category name
- item count below

Examples:

All Menus
0 Items

Accessories - Updated
11 Items

Age Rejuvenating
8 Items

AIR CONDITIONER
5 Items

All-in-One Desktop
0 Items

The text hierarchy should match the screenshot:
- category name more prominent
- item count smaller and muted

==================================================
3. CATEGORY CARD LAYOUT
==================================================

Each category card should have:

- medium-large rounded corners
- white or near-white background
- subtle border
- consistent height
- balanced internal padding
- icon on the left
- text block on the right
- horizontal alignment centered vertically

The cards should feel clickable and optimized for touch/click POS use.

Do not make them too small.
Do not make them overly tall.

==================================================
4. ACTIVE / DEFAULT CATEGORY
==================================================

The "All Menus" category should visually appear as the currently selected or default active category, similar to the screenshot.

Suggested active style:
- slightly stronger visual emphasis
- teal accent icon area
- stronger text contrast

Do not over-style the active state.
Keep it clean and subtle like the reference.

==================================================
5. ICON AREA
==================================================

Each category should have a small icon or colored badge area on the left.

Examples from the screenshot style:
- All Menus → teal grid icon block
- Accessories - Updated → image/media icon
- Age Rejuvenating → circular badge with "AR"
- AIR CONDITIONER → circular badge with "AC"
- All-in-One Desktop → colored icon block / grid icon
- AN... → circular/orange badge with initials

Rules:
- icon area should be compact
- vertically centered
- visually balanced
- use soft brand-friendly colors
- keep icon sizing consistent

Do not use oversized icons.
Do not make icons visually overpower the label.

==================================================
6. CATEGORY NAME HANDLING
==================================================

Show the category name prominently.

Use:
- semibold text
- dark text color
- single-line if possible

If the category name is too long:
- truncate elegantly with ellipsis if necessary
- preserve readable layout

Example:
AN...

Do not allow text wrapping to make the card height inconsistent.

==================================================
7. ITEM COUNT
==================================================

Display the item count below the category name in smaller muted text.

Examples:
0 Items
11 Items
8 Items
5 Items

Rules:
- smaller than the category name
- muted gray color
- aligned consistently under the name

Preserve current item count logic.

Do not hardcode counts if the data already exists dynamically.

==================================================
8. SPACING AND ALIGNMENT
==================================================

Improve the spacing to match the reference:

- equal height for all category cards
- even horizontal gap between cards
- balanced left/right inner padding
- icon and text vertically aligned
- item count consistently positioned

Use a clean spacing rhythm such as:
- 8px
- 12px
- 16px
- 20px

Do not make the cards cramped.
Do not use excessive padding.

==================================================
9. HORIZONTAL SCROLL BEHAVIOR
==================================================

The category row should support horizontal scrolling if there are many categories.

Requirements:
- smooth horizontal scroll
- cards remain on a single row
- preserve usability on desktop POS width
- optional hidden scrollbar or clean scrollbar styling if needed

Do not wrap categories into multiple rows unless absolutely necessary.

==================================================
10. HOVER / CLICK / SELECT STATES
==================================================

The cards should feel interactive.

Suggested states:
- default
- hover
- active/selected

Use subtle visual changes:
- slightly stronger border
- slight background shift
- subtle elevation or shadow
- clear selected indication

Do not use aggressive animation.
Do not use bright heavy effects.

Preserve existing click behavior and category filtering logic.

==================================================
11. VISUAL STYLE
==================================================

Match the screenshot style closely:

- light neutral page background
- white category cards
- soft gray borders
- subtle shadow/elevation
- rounded corners
- dark title text
- muted count text
- teal / magenta / purple / red / orange accent badges/icons
- modern POS appearance

Avoid:
- gradients
- glassmorphism
- heavy shadows
- thick outlines
- oversized text
- over-decorative UI

==================================================
12. FUNCTIONAL PRESERVATION
==================================================

This is mandatory.

Do not break:
- category click behavior
- selected category state
- filtering of product list
- item count display
- category data mapping
- icons if already dynamic
- existing API or state management
- current event handlers

Reuse existing:
- category data
- state
- handlers
- props
- filtering logic

This task is visual enhancement only.

==================================================
13. DO NOT TOUCH OTHER SECTIONS
==================================================

Do not modify:
- top header
- search bar
- product cards
- current order panel
- customer box
- held orders
- recent orders
- summary
- payment area

Only enhance the category listing section.

==================================================
14. RESPONSIVE BEHAVIOR
==================================================

For normal desktop POS width:
- keep categories in one horizontal row
- allow overflow scrolling

For smaller widths:
- keep the same card style
- reduce spacing slightly if needed
- preserve readability and clickability

Do not collapse to a dropdown unless explicitly required later.

==================================================
15. FINAL EXPECTATION
==================================================

The result should be:

"Apply the provided screenshot styling ONLY to the category listing row of my existing POS."

NOT:

"Redesign the entire POS screen."

Preserve all existing category functionality while improving:
- visual polish
- spacing
- consistency
- icon treatment
- selected state
- overall POS category browsing experience