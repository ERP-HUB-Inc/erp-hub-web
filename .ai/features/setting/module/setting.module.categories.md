Enhance my existing **System Settings → Items Management → Categories** page to match both attached screenshots as closely as possible.

Read DESIGN.md, UI_DESIGN_SYSTEM.md, frontend rules, and applicable project instructions first. Inspect the existing category page, APIs, forms, permissions, and POS category configuration.

Reuse existing components, Ant Design where applicable, Lucide icons, design tokens, routing, and query patterns.

## File Locations
- Setting/Modules/Category/form/index.jsx

## 1. Scope and appearance

Reproduce:
- Breadcrumb and category-count badge.
- Page title, Catalog Taxonomy badge, and description.
- Four equal summary cards.
- Search toolbar.
- Category table with all columns and row actions.
- Result count and pagination.

Preserve existing category creation, editing, hierarchy, filters, and other useful functionality, even if outside the screenshot crop.

Visual style:
- Very pale gray-blue page background.
- White cards and table container.
- Dark navy headings.
- Muted slate-blue secondary text.
- Mint/teal positive states.
- Thin pale blue-gray borders.
- Rounded corners and minimal shadows.
- Comfortable spacing and readable Khmer typography.

Follow DESIGN.md for established tokens. Use the screenshots to guide composition, alignment, and visual density.

## 2. Breadcrumb and heading

Breadcrumb:
**System Settings › Items Management › Categories**

- Earlier segments use muted text and working navigation.
- Current segment uses dark semibold text.
- Place a rounded neutral badge beside it: “48 Categories” in the reference.
- Populate the count from actual authorized category totals.

Heading row:
- Large bold title: **Categories**.
- Pale mint outlined pill beside it: **Catalog Taxonomy**.

Description:
“Manage product categories, POS quick-access buttons, default margin rules, and channel visibility across the enterprise catalog.”

Let the description wrap naturally. Preserve existing page actions in a suitable position without disrupting this layout.

## 3. Four summary cards

Display four equal-width, equal-height cards on desktop, two columns on tablet, and one column on mobile.

Each card:
- White background.
- Thin border.
- Approximately 18–20px radius.
- Approximately 24px padding.
- Uppercase muted heading.
- Large bold value below.
- Supporting text at the bottom.
- Rounded icon tile aligned to the right.

### Total Categories
- Heading: TOTAL CATEGORIES.
- Reference value: 48.
- Supporting text: Configured catalog groups.
- Dark navy value.
- Category/shapes icon in a pale mint tile.

### Active Categories
- Heading: ACTIVE CATEGORIES.
- Reference value: 42.
- Supporting text: 87.5% operational.
- Green value.
- Circled-check icon in a pale mint tile.

### Inactive
- Heading: INACTIVE.
- Reference value: 6.
- Supporting text: Archived or drafted.
- Slate value.
- Circled-pause icon in a pale gray-blue tile.

Adapt the supporting text to actual lifecycle states. Do not treat archived, draft, and inactive as equivalent unless the application does.

### Total Linked SKUs
- Heading: TOTAL LINKED SKUS.
- Reference value: 6,537.
- Supporting text: 100% catalog coverage.
- Dark navy value.
- Blue archive/catalog icon in a pale blue tile.
- Coverage text in green when appropriate.

Data:
- Aggregate across the complete authorized scope, not the current page.
- Count linked SKUs distinctly to avoid duplication across categories.
- Define the eligible SKU population consistently when calculating coverage.
- Handle zero denominators and unavailable data.
- Make clear whether summary cards follow search filters or represent overall totals.
- Do not hardcode screenshot numbers.

## 4. Table container and search

Use one large white rounded bordered container.

Top toolbar:
- Search field aligned left.
- Approximately 580px maximum width on the reference desktop layout.
- Search icon on the left.
- Placeholder: “Quick search category name, code…”
- Keyboard hint on the right.

Search category code and supported English/Khmer names using existing server-side search where available.

- Debounce input.
- Reset pagination when search changes.
- Prevent stale responses from replacing newer results.
- Implement Cmd+K / Ctrl+K only if it does not conflict with existing application shortcuts; otherwise omit the hint.
- Retain existing filters and create actions.

Separate the toolbar from the table using a thin border.

## 5. Table columns

Render in this order:

1. Selection checkbox.
2. CATEGORY CODE.
3. CATEGORY NAME.
4. POS COLOR.
5. POS QUICK ACCESS.
6. MAPPED SKUS.
7. DEFAULT MARGIN.
8. STATUS.
9. ACTIONS.

Header:
- Very pale gray-blue background.
- Uppercase semibold slate labels.
- Approximately 12–14px text with subtle tracking.
- Generous horizontal padding.
- Allow Category Code and POS Quick Access to wrap onto two lines as shown.

Rows:
- White background.
- Thin horizontal separators.
- Approximately 88–104px height at the reference scale.
- Vertically centered cells.
- Subtle hover treatment.
- Muted inactive rows while preserving readable contrast.

Use horizontal scrolling on narrow screens. Keep meaningful column widths rather than squeezing labels.

## 6. Category code and name

Category code:
- Bold monospace or existing code font.
- Example: CAT-001.
- Preserve leading zeros.
- Muted styling for inactive categories.

Category name:
- English name on the first line, dark and semibold.
- Actual Khmer translation on the second line, smaller and muted.
- Use a Khmer-capable font with sufficient line height.
- Do not invent translations or reserve an empty second line when unavailable.
- Preserve existing hierarchy indicators or parent context where needed.

## 7. POS color tile

Display a compact rounded rectangular color tile containing:
- A solid circular swatch on the left.
- Color name on the first line.
- Uppercase hexadecimal value on the second line.

Use a lightly tinted background and subtle border related to the configured color.

Reference colors:
- Blue — #3B82F6.
- Amber — #F59E0B.
- Teal — #14B8A6.
- Orange — #F97316.
- Indigo — #6366F1.
- Yellow — #EAB308.
- Purple — #A855F7.
- Cyan — #06B6D4.
- Slate — #64748B.

Use actual configured values. Validate color input and ensure readable text contrast, especially for yellow and other light colors. Use the swatch to preserve the exact configured color when darker text is necessary.

For missing colors, show an accurate neutral “Not set” state.

## 8. POS quick-access state

Use compact dot-and-text pills:

Enabled:
- Pale mint background.
- Thin mint border.
- Green dot and text.

Disabled:
- Pale gray-blue background.
- Subtle neutral border.
- Muted dot and text.

Derive this state from the existing POS quick-access configuration. Keep it independent from category Active/Inactive status.

These are status badges in the screenshot. Do not turn them into inline switches unless existing behavior supports that interaction.

## 9. Mapped SKUs

Display:
- Bold number.
- Muted “SKUs” suffix.

Example: **412** SKUs.

Use actual linked SKU counts and existing parent/child counting rules. Avoid per-row API requests.

If an existing item filter supports category navigation, allow the count to open that authorized filtered view.

## 10. Default margin

Display reference values such as:
- Min 25%.
- Min 20%.
- Min 18%.

Use green text for active configured rules and muted text for inactive rows.

Important:
- Read the actual category margin configuration.
- Preserve the distinction between gross margin and markup.
- Match the label to the existing business definition.
- Distinguish explicit values, inherited values, and no rule.
- Do not display a missing rule as 0%.
- Do not implement automatic price changes as part of this UI enhancement.

Provide a concise tooltip explaining the rule or inheritance when useful.

## 11. Category status

Active:
- Rounded mint pill.
- Dark green text.
- Subtle green border.

Inactive:
- Rounded neutral gray-blue pill.
- Muted slate text.

Use actual lifecycle state. Provide suitable labels for other supported states instead of forcing everything into two categories.

## 12. Row actions

Three horizontally aligned icon buttons:
- Pencil: Edit category.
- Trash: Delete category.
- Vertical ellipsis: More actions.

Use muted outline icons, subtle hover backgrounds, visible focus, and accessible labels.

Behavior:
- Edit opens the existing populated category form.
- Delete uses the existing confirmation and backend rules.
- Prevent deletion when linked items or child categories prohibit it; explain the reason.
- Offer archive/reassignment only if already supported.
- More actions must contain actual supported authorized operations.
- Do not add placeholder menu commands.

After successful changes, refresh affected rows, counts, and summary cards through existing query invalidation.

Keep the existing state after failures and display a useful error.

## 13. Selection

- Header checkbox selects the current page using existing table conventions.
- Show indeterminate state for partial selection.
- Distinguish current-page selection from selecting all matching results.
- Preserve existing supported bulk actions.
- Do not introduce destructive bulk operations just because checkboxes appear in the screenshot.

## 14. Reference rows

Use these only as development fixtures for visual comparison:

| Code | Category | Color | POS Quick Access | Mapped SKUs | Default Margin | Status |
|---|---|---|---|---:|---|---|
| CAT-001 | Accessories & Electronics | Blue | Enabled | 412 | Min 25% | Active |
| CAT-002 | Food & Confectionery | Amber | Enabled | 620 | Min 20% | Active |
| CAT-003 | Beverages & Drinks | Teal | Enabled | 345 | Min 18% | Active |
| CAT-004 | Hardware & Tools | Orange | Disabled | 128 | Min 22% | Active |
| CAT-005 | Mobile Phones & Tablets | Indigo | Enabled | 295 | Min 12% | Active |
| CAT-006 | Snacks & Chips | Yellow | Enabled | 186 | Min 20% | Active |
| CAT-007 | Network Cables & Gear | Purple | Disabled | 85 | Min 30% | Active |
| CAT-008 | Logic Boards | Cyan | Disabled | 48 | Min 25% | Active |
| CAT-009 | Industrial Lubricants | Slate | Disabled | 24 | Min 15% | Inactive |

Use real production records and translations. The sample row counts do not need to sum to the overall linked-SKU statistic because they represent only one page.

## 15. Footer and pagination

Bottom-left:
“Showing 1 to 9 of 48 categories”.

Bottom-right:
- Previous.
- Page buttons.
- Next.

Style:
- White outlined rounded buttons.
- Active page uses solid dark teal with white text.
- Disabled controls use muted styling.
- Comfortable spacing and click targets.

Use actual pagination metadata, page size, and ranges. Do not force nine rows merely to imitate the screenshot.

Keep pagination consistent with the existing API and URL-state conventions.

## 16. Integration and page states

- Reuse existing category APIs and forms.
- Respect tenant, location, and permission boundaries.
- Preserve parent-child category relationships.
- Do not change POS behavior or margin enforcement merely through presentation changes.
- Extend existing aggregate queries only when necessary.
- Provide summary and table loading skeletons.
- Distinguish unavailable metrics from confirmed zero.
- Provide empty-catalog and no-search-results states.
- Provide retryable errors.
- Keep existing creation/setup actions accessible.

## 17. Verification

Implement the changes fully.

Verify:
- Both screenshots’ sections are represented.
- All four statistic cards align.
- All nine table columns match the reference.
- Bilingual names, color tiles, badges, counts, margins, actions, and pagination render correctly.
- Search, selection, edit, deletion restrictions, and navigation work.
- Existing category functionality is preserved.
- Desktop, tablet, mobile, keyboard access, and Khmer rendering are correct.

Run appropriate lint/type checks and relevant existing tests. Where browser preview is available, compare the rendered page against both screenshots and correct spacing, sizing, and alignment differences.

Report changed files, verification results, and any missing backend fields or integrations.