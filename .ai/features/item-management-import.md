Implement the **Import Items from Excel / CSV** page in my existing MarketChain ERP application, matching the attached screenshot and following the attached DESIGN.md.

Read DESIGN.md and the existing project/frontend/backend instructions before implementation. Inspect the existing item import, inventory adjustment, warehouse, supplier, pricing, and background-job services.

Reuse existing components and import workflows. Preserve the shared header, sidebar, and unrelated Item Management functionality.

## 1. Design specifications

Use existing application tokens mapped to DESIGN.md. Do not introduce a competing theme or change global styles unnecessarily.

Apply these component specifications:
- Primary action: #14b8a6.
- Primary hover: #0f766e.
- Primary active: #115e59.
- Primary border: #0d9488.
- Main text: #0b1c30.
- Cards: #ffffff.
- Tinted fields/panels: #eff4ff.
- Mint surfaces: #f0fdfa.
- Default border: #e2e8f0.
- Hover border: #cbd5e1.
- Success: text #115e59, background #ccfbf1, border #99f6e4.
- Warning: text #92400e, background #fffbeb, border #fde68a.
- Danger: text #9f1239, background #fff1f2, border #fecdd3.

Typography:
- Page title: Plus Jakarta Sans, 36px/44px, weight 700; mobile 28px/36px.
- Section titles: Plus Jakarta Sans, 20px/28px, weight 600.
- Body: Inter, 14px/20px.
- Secondary text: Inter, 13px/18px.
- Micro-labels: Inter, 11px/14px, weight 600, uppercase with 0.04em tracking.
- Numeric quantities, amounts, SKU references, and IDs: tabular numerals.
- Use an appropriate Khmer fallback font and sufficient line height.

Sizing:
- Cards: 24px radius and 24px padding where appropriate.
- Inputs/buttons: 8px radius and 40px height.
- Dense table controls: 36px where appropriate.
- Badges: approximately 22px height, 2px 8px padding, pill radius.
- Checkboxes/radios: 18px × 18px.
- Desktop gaps: 24px; tablet/mobile gaps: 16px.
- Outer margins: desktop 32px, tablet 24px, mobile 16px.
- Card shadow:
  0 1px 3px 0 rgba(15,23,42,0.04),
  0 1px 2px -1px rgba(15,23,42,0.02).

DESIGN.md contains alternative canvas values in its token block and narrative. Reuse the application’s established mapped background token; if none exists, use #f8f9ff to match the screenshot. Follow explicit component specifications for controls and document any necessary token mapping.

Verify actual contrast for small labels and primary buttons; adjust the foreground/background pairing using the supplied palette when necessary.

## 2. Page header

Include:
- Breadcrumb:
  Dashboard > Items Management > Import Items.
- Current breadcrumb highlighted in teal.
- Title: Import Items from Excel / CSV.
- Description:
  “Upload your master product catalog, supplier stock sheets, or central price lists to bulk populate or update your multi-facility inventory ledger.”
- Right-side actions:
  - Discard & Back to Items, with left arrow.
  - Teal Import Guide, with help icon.

Discard returns to the existing Item Management route. Protect meaningful unsaved work using the existing confirmation pattern.

Import Guide opens useful instructions in the established modal/drawer/page pattern.

## 3. Four-step progress indicator

Create a full-width white rounded stepper:

1. STEP 01 — Upload File.
   - Cloud-upload icon.
   - Active mint background.
   - Teal icon tile, label, status dot, and right-edge accent.
2. STEP 02 — Schema & Mapping.
   - Mapping icon.
3. STEP 03 — Data Cleansing.
   - Validation/checklist icon.
4. STEP 04 — Commit & Ingest.
   - Rocket icon.

Inactive steps use muted text and pale blue icon tiles.

The screenshot shows Step 1. Implement this state faithfully and connect subsequent steps to the existing import workflow. Steps must reflect actual session progress and validation; users cannot skip required checks.

If later-step screens do not exist, implement functional mapping, validation review, and commit states using existing design patterns. Do not fake completed steps.

## 4. Main layout

Desktop:
- Left column approximately two-thirds:
  - Data Source File.
  - Import Mode & Conflict Resolution.
- Right column approximately one-third:
  - Download Templates.
  - Pro-tips & Guidelines.
  - Catalog Database status.
- Full-width Recent Ingestion Logs below both columns.

Stack naturally on smaller screens. Keep the stepper and logs accessible without clipping.

## 5. Data Source File card

Header:
- File-upload icon.
- Data Source File.
- Right status badge:
  “Server Ready · Toul Kork Cluster” in the reference.

Show server readiness and cluster names only when available from actual configuration/status. Do not hardcode infrastructure claims.

Upload area:
- Large softly tinted drop zone.
- Centered cloud-upload icon in a mint rounded square.
- Heading:
  “Drag & drop your Excel or CSV file here”.
- Supporting text:
  “or browse from your local drive. Supports structured spreadsheets up to 25 MB or 10,000 SKUs per import session.”
- Teal Browse Files button with file icon.
- Optional platform-appropriate keyboard shortcut hint, only if implemented.
- Secondary Import from Google Sheets button with cloud icon.
- Supported-format chips:
  - .XLSX
  - .XLS
  - .CSV (UTF-8)
  - Tab Delimited

Use actual configured upload limits. Inspect existing limits before adopting the screenshot’s 25 MB / 10,000 values. Frontend and backend limits must agree.

Upload interactions:
- Support drag-and-drop and native file selection.
- Show selected filename, size, worksheet selection when needed, parsing/upload progress, and remove/replace actions.
- Provide clear errors for unsupported, empty, corrupt, password-protected, or oversized files.
- Preserve the source file/session while moving through steps.
- Do not execute spreadsheet formulas, macros, or external links.
- Preserve leading zeros in SKUs, barcodes, and phone-like identifiers.
- Treat formulas and cached values according to an explicit existing import policy.

Google Sheets:
- Reuse existing integration if available.
- Otherwise provide an explanatory dialog with supported export/upload instructions.
- Do not pretend a connection or import succeeded.

Bottom information strip:
- Shield icon.
- Reference:
  “Client-side preflight schema scan active. Data remains encrypted via TLS 1.3.”
- Right:
  “Auto-encoding: UTF-8 / Windows-1252”.

Only claim client-side scanning, TLS version, or supported encodings when true. Use accurate wording such as “Secure upload” only when supported.

Support UTF-8 and BOM detection. Offer encoding/delimiter selection where needed; do not silently corrupt Khmer text through an incorrect fallback encoding.

## 6. Import Mode & Conflict Resolution card

Header:
- Settings/sliders icon.
- Import Mode & Conflict Resolution.
- Right metadata:
  “Config ID: SYS-IMP-DEFAULT” in the reference, using actual configuration if available.

Three selectable radio tiles:

### Smart Upsert
- Selected by default only if consistent with existing application policy.
- Teal checked indicator.
- RECOMMENDED badge.
- Mint background.
- Description:
  “Inserts new catalog items while safely updating prices, barcodes, and stock levels for existing SKUs.”

Use accurate wording for the actual supported update fields. Do not imply inventory changes are ordinary catalog-field updates.

### Create New Only
- Radio indicator.
- ADD ONLY micro-label.
- Description:
  “Strictly registers newly discovered SKUs. Automatically ignores any item that matches an existing internal barcode.”

Use the application’s real matching key and uniqueness rules. Skipped existing records must appear in the preview/results.

### Stock Update Only
- Radio indicator.
- STOCK LEDGER micro-label.
- Description:
  “Adjusts physical quantity on-hand and bin locations only. Master titles, tax, and categories remain unchanged.”

Implement stock changes through the existing inventory ledger/adjustment workflow, with reason, actor, location, and audit history. Do not directly overwrite stock balances.

Explicitly distinguish:
- Setting an absolute stock count.
- Adding/subtracting an adjustment.
- Receiving a purchase order.

Do not interpret the same quantity as different operations silently.

Below the mode tiles, include a tinted two-column settings panel:

### Target Warehouse / Distribution Center
- Warehouse icon and label.
- Selector.
- Reference:
  Phnom Penh DC · Toul Kork Hub.
- Help text:
  “Physical inventory lines will be credited directly to this facility’s primary zone.”

Adapt help text to the real stock operation. Require a warehouse when needed and restrict choices to authorized locations.

### Duplicate SKU Handling
- Duplicate/conflict icon and label.
- Selector.
- Reference:
  “Overwrite with latest row in spreadsheet”.
- Help text:
  “Determines behavior if identical SKU code appears twice in the same file.”

Support existing conflict policies. If implementing the reference policy, define “latest” as the last source row, preserve row numbers, and disclose overwritten/skipped rows.

Keep file-internal duplicates separate from conflicts with existing database records.

## 7. Download Templates card

Include:
- Download icon tile.
- Heading: Download Templates.
- Subtitle: Verified Schema v3.4.
- Description explaining that templates help structure columns for mapping and validation.

Use the actual schema version; do not hardcode v3.4.

Two downloadable template tiles:
1. Excel Template (.XLSX).
   - Spreadsheet icon.
   - “Includes formula validation & dropdowns”.
   - Download icon on the right.
2. CSV Standard (.CSV).
   - File icon.
   - “Pure UTF-8 format for custom ERP exports”.
   - Download icon on the right.

Generate or serve real templates matching backend validation. Only claim formulas/dropdowns if present. Use UTF-8 CSV suitable for Khmer and document separator conventions.

Mint Required Field Specifications panel:
- Required:
  Product Name, SKU / Barcode, Buying Cost, Retail Price.
- Optional:
  Initial Qty, Warehouse Bin, Category, Expiry.
- Multi-Language:
  Full UTF-8 support for Khmer and English.

Adapt required fields by import mode. For example, stock-only import should not unnecessarily require catalog prices if the backend does not need them.

Clarify whether “SKU / Barcode” means either identifier or separate fields.

## 8. Pro-tips & Guidelines card

Include a lightbulb icon and three tinted information panels:

### Speed Tip
Reference:
“Files under 2,000 rows process in under 4 seconds with real-time discrepancy alerts.”

Do not promise fixed processing performance without measured support. Replace with truthful advice such as:
“Smaller batches are easier to review. Processing time depends on file size and validation.”

### Barcodes
Reference:
“Accepted types include EAN-13, UPC-A, Code-128, and custom company alphanumeric tags.”

List only supported formats and enforce existing validation rules. Keep identifiers as strings.

### Currencies
Reference:
“Dual USD ($) & KHR (៛) columns supported with auto-conversion rate lock.”

Use existing currency configuration and explicit rate selection/snapshot rules. Do not silently convert ambiguous amounts.

## 9. Catalog Database status card

Include:
- Database/server icon in a mint tile.
- Micro-label: CATALOG DATABASE.
- Value: 42,890 Active SKUs.
- Right status pill: Synced.

Use actual distinct active SKU count and real sync status. Display a neutral unavailable state when status is unknown.

Respect tenant/location scope and do not expose unauthorized inventory totals.

## 10. Recent Ingestion Logs

Full-width card below the main layout.

Header:
- History icon.
- Title: Recent Ingestion Logs (Last 7 Days).
- Description:
  “Review previous batches, resolve pending validation warnings, or download reconciliation summaries.”
- Right search:
  “Filter batch or user…”
- Refresh button with refresh icon.

Table columns:
1. BATCH ID & FILE NAME.
2. IMPORTED BY.
3. TIMESTAMP.
4. ROW COUNT.
5. INGESTION STATUS.
6. ACTION.

Row structure:
- File-type/status icon.
- Filename.
- Secondary batch ID and import mode.
- Importer initials avatar and name.
- Timestamp in configured timezone.
- Source row count, clearly labeled.
- Semantic status badge.
- Contextual action.

Reference rows:
1. Catalog_Q4_2026.xlsx.
   - BATCH-88219 · Smart Upsert.
   - Alex Rivera.
   - Today, 10:15 AM.
   - 48 Rows.
   - Warning: 3 Validation Errors · Review Needed.
   - Teal Resume Session button with arrow.

2. Beverages_Restock_Nov.csv.
   - BATCH-88194 · Stock Update.
   - Sophanna M.
   - Nov 12, 2026 · 04:45 PM.
   - 154 Items.
   - Completed (100% Ingested).
   - View Summary button.

3. Hardware_Spare_Parts.xlsx.
   - BATCH-87980 · Create New.
   - Alex Rivera.
   - Nov 08, 2026 · 09:20 AM.
   - 620 Items.
   - Completed (100% Ingested).
   - View Summary button.

These are visual fixtures only. Use real dates and consistently apply the Last 7 Days scope; do not reproduce reference dates outside that period.

Footer:
- Information icon.
- “Showing 3 of 42 recent file ingestion tasks. Ingestion logs are archived for 90 days.”
- Right link:
  Open Ingestion Audit Ledger →.

Use actual totals, retention policy, and pagination/load-more conventions. Do not claim 90-day retention unless configured.

Resume Session restores actual persisted state. View Summary shows real created/updated/skipped/failed counts and downloadable error details. Protect all sessions and logs with existing authorization.

## 11. Mapping, cleansing, and commit behavior

Connect the four-step journey end to end:

### Schema & Mapping
- Preview source headers and sample rows.
- Map source columns to supported item fields.
- Auto-suggest mappings but require resolution of missing/ambiguous required fields.
- Support worksheet/header-row selection where necessary.
- Validate mapping before continuing.

### Data Cleansing
- Display row-level errors and warnings with source row numbers.
- Identify invalid amounts, missing required fields, duplicate identifiers, unknown warehouses/categories, and invalid expiry dates.
- Reject NaN and Infinity; do not silently replace malformed money values with zero.
- Use explicit numeric/date conventions.
- Preserve valid zero values where permitted.
- Show proposed changes and create/update/skip/error counts.
- Support corrections or an error-file download according to existing patterns.
- Make partial-import versus all-or-nothing behavior explicit.

### Commit & Ingest
- Show a final review of file, mode, destination, conflict policy, quantities, and proposed changes.
- Require an explicit commit action before writing catalog or stock data.
- Revalidate server-side.
- Use the existing transaction/job model and display truthful progress.
- Make retries idempotent so network retries/resume cannot duplicate items or inventory movements.
- Handle concurrent catalog/stock changes through existing safeguards.
- Record an auditable result and refresh affected Item Management statistics and queries.
- A summary or notification failure must not rerun a completed import.

## 12. Integration, states, and completion

- Use existing upload security, file parsing, API clients, background jobs, and storage conventions.
- Enforce file size, row count, field, and permission validation on the backend.
- Keep temporary files and import-session retention aligned with project policy.
- Provide loading, parsing, uploading, validation, processing, completed, failed, and interrupted states.
- Preserve user work after recoverable errors.
- Keep missing integrations truthful; do not fake server readiness, sync, downloads, progress, or successful imports.

Verify every visible screenshot section, responsive behavior, actual template downloads, mode selection, warehouse selection, duplicate handling, mapping, validation, commit, resume, logs, and summary actions.

Run appropriate lint/type checks and meaningful existing/import tests, especially duplicate handling, malformed numeric values, stock update semantics, and retry idempotency.

Complete the implementation. Report changed files, design-token mapping, checks performed, and any remaining integration dependencies.