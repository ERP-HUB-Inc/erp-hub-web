Enhance my existing **System Settings → Modules** page to match the attached screenshot as closely as possible.

Read DESIGN.md, UI_DESIGN_SYSTEM.md, frontend rules, and applicable project instructions first. Inspect the existing settings page, module configuration, permissions, and navigation before editing.

Reuse the existing React components, Ant Design primitives where applicable, Lucide icons, design tokens, API clients, and routing conventions.

## Files Location
- src/pages/Setting/SettingPage.jsx

## 1. Scope

Recreate the screenshot’s:
- Page heading and search field.
- Horizontal settings tabs.
- Modules section heading and synchronization banner.
- Five module configuration cards.
- Icons, category badges, setting rows, metadata badges, toggles, and footer actions.

Preserve the existing shared application header, sidebar, routes, and settings functionality.

Use actual application data. Screenshot counts, dates, configuration values, and synchronization claims are examples only.

## 2. Page header

Left:
- Large bold heading: **System Settings**.
- Description:
  “Configure global preferences, business modules, workflow automation, and master ERP parameters.”

Right:
- White outlined search field.
- Filter icon on the left.
- Placeholder: “Filter settings or toggles…”
- Keyboard hint: ⌘/ on macOS or Ctrl+/ elsewhere, only if implemented.

Search should filter matching module cards and setting entries using their titles, descriptions, and keywords. Keep matching entries in their module context and provide a clear empty state.

## 3. Settings tabs

Render these tabs in this order:

1. General.
2. Users & Permissions.
3. Modules.
4. Integration & APIs.
5. Backup & Security.
6. Workflows & Automation.
7. Reports & Exports.
8. System Logs & Audit.

Active Modules tab:
- Teal text with semibold weight.
- Thin teal underline.
- Rounded pale mint count badge: “9 Active” in the reference.

Use the actual active-module count and its existing definition. It may include modules outside the five visible cards; do not derive it from an arbitrary displayed subset.

Inactive tabs use muted slate text. A thin border runs below the full tab row.

Connect tabs to existing settings sections. Preserve existing URL/tab state conventions. Allow horizontal scrolling on smaller screens.

## 4. Modules section header

Left:
- Heading: **ERP Modules Configuration**.
- Description:
  “Configure and manage ERP modules including product setup, inventory, sales, finance, and HR settings.”

Right:
- Pale mint status banner.
- Thin green border.
- Green status dot.
- Reference text:
  “All systems synchronized across 14 warehouse nodes”.

Only show this synchronization claim when backed by actual status data. Otherwise use an accurate pending, failed, last-synced, or unavailable state.

Align the heading group and banner horizontally on wide screens and stack them on smaller screens.

## 5. Five-card grid

At the screenshot’s wide desktop width:
- Show all five cards in one row.
- Use equal-width, equal-height cards.
- Approximately 24–32px gaps, adapting to DESIGN.md.
- White backgrounds.
- Subtle pale blue-gray borders.
- Approximately 18–20px corner radius.
- No heavy shadows.
- Approximately 24px internal padding.
- Pale tinted footer pinned to the bottom of every card.

Use a responsive grid:
- Five columns only when cards have enough room.
- Three or two columns at intermediate widths.
- One column on mobile.

Do not force five narrow columns on ordinary laptop screens.

Card structure:
1. Colored icon tile, module title, and top-right toggle.
2. Small uppercase category badge under the title.
3. Muted description.
4. Vertical list of configuration entries.
5. Bottom footer with metadata on the left and action with chevron on the right.

Keep footer baselines aligned. Use a flexible card body rather than hardcoded blank spacers.

## 6. Card: Items Management

Header:
- Blue four-square/grid icon in a pale blue rounded tile.
- Title on two lines: **Items Management**.
- Enabled teal toggle at top right.
- Category badge: **CORE CATALOG**, blue text on pale blue.

Description:
“Configure product categories, multi-level variants, barcode rules, and measurement standards.”

Configuration rows:
- Tag icon — Categories & Hierarchy.
  - Right badge: “48 Items”.
- Building icon — Brands & Makers.
  - Right badge: “112 Brands”.
- Calculator/ruler icon — Units of Measurement (UOM).
- Sliders icon — Item Option.
- Classification/grid icon — Item Type.

Footer:
- Left: “Updated today”.
- Right teal action: **Configure ›**.

Use actual category/brand counts and update metadata.

## 7. Card: Inventory Settings

Header:
- Green storage/box icon in a pale mint tile.
- Title: **Inventory Settings**.
- Enabled teal toggle.
- Category badge: **STOCK POLICIES**, green text on pale mint.

Description:
“Configure warehouses, stock levels, valuation logic, and multi-location inventory policies.”

Configuration rows:
- Warehouse icon — Warehouse & Bins Setup.
  - Green badge: “9 Nodes”.
- Bell icon — Automated Stock Alerts.
  - Pale pink badge: “Active”.
- Clipboard icon — Lot, Batch & Serial Tracking.
- Circular arrows icon — Reconciliation Cycles.
- Calculator icon — Costing Method (FIFO/Avg).

Footer:
- Left: “14 nodes synced”.
- Right teal action: **Manage ›**.

Use actual warehouse counts, alert state, costing method, and synchronization data. Preserve any distinction between configured warehouses and synchronized nodes.

## 8. Card: Sales Configuration

Header:
- Amber shopping-cart icon in a pale amber tile.
- Title: **Sales Configuration**.
- Enabled teal toggle.
- Category badge: **COMMERCE**, amber text on pale cream.

Description:
“Configure pricing, promotional discount schemes, territories, and point-of-sale registers.”

Configuration rows:
- Currency icon — Price Lists & Tiers.
  - Neutral badge: “3 Active”.
- Tag icon — Discount Rules & Bundles.
- Map-pin icon — Sales Territories & Zones.
- Message icon — Social Commerce Integration.
- Monitor icon — POS Terminal Registers.

Footer:
- Left: “6 Channels connected”.
- Right teal action: **Edit ›**.

Use actual configured price lists and connected channels.

## 9. Card: Finance Setup

Header:
- Purple bank/landmark icon in a pale lavender tile.
- Title: **Finance Setup**.
- Enabled teal toggle.
- Category badge: **GENERAL LEDGER**, purple text on pale lavender.

Description:
“Configure chart of accounts, tax rates, currencies, fiscal years, and payment accounts.”

Configuration rows:
- Document icon — Chart of Accounts (COA).
- Receipt icon — Tax & VAT Configuration.
  - Mint badge: “10% VAT”.
- Globe icon — Multi-Currency Rates.
  - Compact secondary text: “USD / KHR”.
- Payment-card icon — Payment Gateways & Cashiers.
- Hash icon — Invoice Numbering Sequences.

Footer:
- Left: “Fiscal year: 2025”.
- Right teal action: **Review ›**.

Use actual tax configuration, currencies, and fiscal year. Do not assume a single VAT rate applies to all items or transactions.

## 10. Card: Business Insights & Health

Header:
- Teal bar-chart icon in a pale mint tile.
- Title wrapping across lines: **Business Insights & Health**.
- Enabled teal toggle.
- Category badge: **STRATEGY & AI**, teal text on pale mint.

Description:
“Configure revenue targets, minimum profit margin thresholds, stock risk alert rules, and automated executive forecast models.”

Configuration rows:
- Trending-up icon — Sales Targets & Revenue Goals.
  - Neutral badge: “Branch Quotas”.
- Circular status icon — Margin Health & Profit Floors.
  - Green badge: “Min 20% Rule”.
- Warning-triangle icon — Stock Risk & Buffer Policies.
  - Neutral badge: “60-Day Max”.
- Bell icon — Executive Alert Triggers.
  - Pale pink badge: “Active”.
- Zap icon — Forecast & AI Run-Rate Model.
  - Mint badge: “Configured”.

Footer:
- Left: “Auto-synced daily”.
- Right teal action: **Configure ›**.

Populate badges from actual configuration. Do not claim AI functionality, configured forecasting, or daily synchronization unless supported.

## 11. Visual precision

Match the screenshot’s hierarchy:
- Very pale gray-blue page background.
- Dark navy headings.
- Muted slate-blue descriptions.
- Teal switches and footer links.
- Small muted outline icons beside configuration entries.
- Soft category-specific accent colors.
- Compact rectangular metadata badges with gently rounded corners.
- Comfortable line height and spacing.

Approximate sizes, subject to DESIGN.md:
- Page heading: 40–48px, bold.
- Section heading: 28–32px, bold.
- Module titles: 22–26px, semibold.
- Descriptions and setting rows: 15–17px.
- Category badges: 11–13px, semibold.
- Row icons: 18–20px.
- Module icon tiles: approximately 48–56px.
- Toggles: approximately 48–52px wide and 28–30px tall.

Keep text readable at normal browser zoom. Let long labels wrap naturally. Do not reproduce awkward line breaks by inserting manual breaks into every label.

Place badges in a dedicated right-side column so they do not overlap labels. Allow them to wrap internally where appropriate.

## 12. Navigation and toggles

- Connect configuration rows to their existing authorized page, drawer, or tab.
- Connect footer actions to the module’s main configuration screen.
- Reuse existing navigation; do not create dead links.
- For unavailable features, use an accurate disabled or “Not configured” state rather than a fake working action.

Module switches:
- Bind to the real module-enabled state.
- Reuse existing update endpoints and authorization.
- Show pending state during changes.
- Restore the previous state and show a useful error if an update fails.
- Follow existing confirmation rules when disabling a module affects operations.
- Respect module dependencies and protected core modules.
- Do not create a new module-disable backend mechanism merely to imitate a decorative screenshot switch.
- If disabling is unsupported, present an appropriately labeled disabled/read-only state.

## 13. States and accessibility

- Loading skeletons that preserve card layout.
- Accurate zero and unavailable values.
- Widget-level error and retry behavior.
- Read-only presentation for users without edit permission.
- Accessible switch labels and checked states.
- Keyboard-accessible links and visible focus states.
- Accessible tabs and search.
- Text labels alongside status colors.
- Khmer and English font support.
- Prevent horizontal page overflow.

## 14. Completion

Implement the page; do not stop at a plan.

Compare the result with the screenshot:
- Header and search.
- All eight tabs.
- Active Modules badge and underline.
- Section heading and synchronization banner.
- All five cards, descriptions, setting rows, badges, toggles, and footers.
- Equal-height desktop layout and responsive behavior.

Report changed files, working navigation and settings operations, verification results, and any missing integrations.