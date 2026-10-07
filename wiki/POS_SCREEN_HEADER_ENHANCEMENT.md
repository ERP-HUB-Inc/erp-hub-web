Enhance ONLY the top header of my existing MarketChain POS screen.

Use the provided screenshot as the exact visual reference for the header.

CRITICAL:
Do NOT modify any part of the POS below the header.
Do NOT change:
- category tabs
- product grid
- order/cart panel
- customer section
- held orders
- recent orders
- totals
- Pay button
- payment flow
- existing page layout

This task is HEADER ONLY.

==================================================
TARGET HEADER
==================================================

Recreate/enhance the existing POS header to closely match the provided screenshot.

Keep the header as a single horizontal row.

The target structure is:

LEFT:
[ Search item name / SKU / Barcode                  ⌘K / F2 ]

RIGHT:
[ location icon ] ToulKork
[ green dot ] Online
[ green status pill ] Shift Open
10:45 AM
[ + New Sale   F1 ]
vertical divider
[ SM avatar ] Sophanna M.
              Signed in
[ dropdown arrow ]

==================================================
1. SEARCH FIELD
==================================================

Keep the search input on the far left.

Placeholder:
Search item name / SKU / Barcode

Style:
- long rounded input
- subtle light border
- white background
- search icon on left
- muted placeholder text
- compact height
- keyboard shortcut badge on right

Shortcut badge:
⌘K / F2

The shortcut badge should look like a small subtle pill inside the search field.

IMPORTANT:
Preserve the current working functionality of the search field:
- item search
- SKU search
- barcode search
- barcode scanner input
- keyboard focus behavior

Do not replace or rewrite existing search logic.

==================================================
2. RIGHT HEADER INFORMATION
==================================================

Place all POS session information on the right side of the same header row.

Keep the exact order:

1. Branch
2. Online status
3. Shift status
4. Current time
5. New Sale
6. User profile

Do not wrap them to another row.

==================================================
3. BRANCH DISPLAY
==================================================

Show:

location icon
ToulKork

Use:
- small location pin icon
- dark readable text
- semibold branch name

Do not show:
Branch: ToulKork

Keep it compact like the reference.

==================================================
4. ONLINE STATUS
==================================================

Show:

● Online

Use:
- small green dot
- green text
- lightweight status style

Do not put it inside a large button.

==================================================
5. SHIFT STATUS
==================================================

Show:

● Shift Open

Use a small rounded green/light-teal status pill.

Style:
- pale green background
- subtle green border
- green status dot
- compact height
- rounded pill
- readable text

This is status information, not a large primary action.

Preserve existing shift logic and click behavior if already implemented.

==================================================
6. CURRENT TIME
==================================================

Show current time after Shift Open.

Example:
10:45 AM

Style:
- compact
- neutral muted/dark text
- vertically centered

Do not make it visually dominant.

==================================================
7. NEW SALE BUTTON
==================================================

Keep the existing New Sale action.

Style it like the screenshot:

[ + New Sale   F1 ]

Requirements:
- rounded outline button
- teal border
- teal text
- small circular/plus icon
- keyboard shortcut badge "F1" on right
- compact height

Preserve the current New Sale handler and business logic.

Do not change what New Sale currently does.

==================================================
8. SEPARATOR
==================================================

Add a subtle vertical divider between:

New Sale

and

User Profile

Use a thin light-gray vertical line.

Keep spacing similar to reference.

==================================================
9. USER PROFILE AREA
==================================================

Keep the profile section on the far right.

Structure:

[ SM ] Sophanna M.
       Signed in      ▼

Avatar:
- small circular avatar
- initials "SM"
- dark blue background or current brand-safe avatar color
- white initials
- centered

User text:
Primary:
Sophanna M.

Secondary:
Signed in

Style:
- primary text dark and semibold
- secondary text small and muted
- compact two-line layout

Add a small dropdown chevron on far right.

Preserve current profile dropdown functionality.

==================================================
10. HEADER DIMENSIONS
==================================================

Keep header height compact and approximately the same as the reference.

Do not make the header taller.

Use:
- vertically centered controls
- balanced horizontal spacing
- enough whitespace without wasting screen area

The header should feel optimized for POS operation.

==================================================
11. VISUAL STYLE
==================================================

Match the screenshot closely:

- white background
- subtle bottom border
- clean modern POS appearance
- very light shadows only if already part of current design
- soft gray border colors
- teal primary accent
- green status indicators
- dark navy/gray text
- rounded controls
- compact typography

Avoid:
- gradients
- glassmorphism
- heavy shadows
- large buttons
- oversized icons
- excessive padding

==================================================
12. RESPONSIVE BEHAVIOR
==================================================

For normal desktop POS width:
keep everything on one row.

Layout concept:

Search                              ToulKork ● Online ● Shift Open 10:45 AM [ + New Sale F1 ] | [SM] Sophanna M. ▼

Do not break into a two-row header unless the viewport becomes genuinely too narrow.

If space becomes limited:
- preserve Search
- preserve Shift status
- preserve New Sale
- preserve User profile
- compact spacing before removing useful information

==================================================
13. FUNCTIONAL PRESERVATION
==================================================

This is mandatory.

Do not break or rewrite:
- search handlers
- barcode scanning
- SKU search
- keyboard shortcuts
- branch state
- online/offline state
- shift state
- New Sale action
- profile dropdown
- authentication/session state

Reuse existing components, props, state, handlers, and API logic wherever possible.

Only update:
- header layout
- styling
- spacing
- alignment
- typography
- icons
- visual hierarchy

==================================================
14. DO NOT TOUCH ANYTHING ELSE
==================================================

Do not modify any component below the top header.

Do not modify:
- category navigation
- products
- cards
- order sidebar
- cart
- discounts
- customer
- held orders
- recent orders
- totals
- Pay button
- payment screen
- backend logic

The final result should be:

"Apply the provided screenshot design ONLY to my existing POS header while preserving all current functionality."

NOT:

"Redesign my POS screen."