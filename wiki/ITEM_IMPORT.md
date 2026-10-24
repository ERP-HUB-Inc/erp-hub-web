# Item import preparation

Entry: Item Management → Import Items → `/inventories/items/import`. The existing authenticated application shell is preserved. The stock tab keeps its separate Stock IO import destination.

## Available

- Local Excel/CSV/tab-delimited parsing with the installed SheetJS dependency; no file or catalog data is sent to a service.
- Explicit encoding/delimiter selection, worksheet/header-row selection, source preview, mapping, required-field checks, formula rejection, finite non-negative prices, and file-internal duplicate policies.
- Barcode strings and formatted leading zeros are retained. Zeros already removed by the spreadsheet application cannot be recovered. Save identifier columns as text.
- Real header-only XLSX and UTF-8 BOM CSV templates; literal-string XLSX review exports with source rows, errors, warnings, and disclosed skips.
- All retained rows must pass local checks. Nonzero opening quantities are rejected; stock movements belong in a ledger workflow.
- Files/mappings remain in memory across steps. Route and browser-close prompts protect unsaved preparation; there is no persisted session or automatic retry.

Browser safeguards: 25 MB, 10,000 source rows after the header, 200 columns, header rows 1–100. These are **local preflight limits**, not existing backend limits. The current upload middleware does not specify matching size/row limits.

## Server dependency

Commit, Smart Upsert, Stock Update, warehouse assignment, log search/refresh, resume, and audit summaries are unavailable until a safe import API exists. UI controls explain their availability. No fabricated logs, counts, readiness, infrastructure, schema version, or successful imports are shown.

Inspected `pos-api` ItemController `/items/import`, ItemService `importProducts`, upload middleware, and existing frontend item, stock-adjustment, Stock IO, location, supplier, and pricing services. The current import takes a `csv` multipart field but parses the first Excel worksheet positionally as name, barcode, category, cost, retail price, wholesale price, distributor price, opening stock, and unit. The transaction promise is not returned. Existing barcode/category/unit/location queries are not consistently tenant scoped, and opening stock is written directly to balances. It provides no dry run, operation modes, session persistence, ingestion job/status, idempotency key, concurrency validation, or ingestion logs. Therefore the new frontend deliberately does not call it.

Required server work before enabling commit:

1. Authenticated, authorized, tenant/location-scoped session creation with enforced upload/row/field limits and private temporary-file retention.
2. Server-side mapping and validation using the same explicit schema and formula/numeric policies. Return source-row errors and real proposed create/update/skip/error counts. Resolve category/unit names according to an agreed policy.
3. Barcode uniqueness enforcement, explicit database conflict behavior, and atomic imports. File-internal first/last policies refer to source row order and remain separate from database conflicts.
4. A durable idempotency key and queryable job/session state so timeouts and retries cannot duplicate writes; return the transaction/job result only after it is known.
5. For stock modes, an authorized warehouse and explicit absolute-count versus adjustment operation, actor, reason, audit history, and concurrency safeguards. Purchase receiving remains a separate workflow.
6. Scoped seven-day history, pagination, importer/timezone metadata, real outcome counts, resume, reconciliation downloads, retention metadata, and distinct active-SKU/sync status if supported.

Do not replace these guarantees with client-side flags or calls to per-item create/update APIs.

## Design mapping

No `DESIGN.md` or reference screenshot was present in the checkout/request. The explicit feature specs override `wiki/UI_DESIGN_SYSTEM.md` where specified. Canvas uses the documented established `#f7f7fc`; local cards, borders, mint panels, teal actions, amber warnings, and rose errors use the feature palette. All CSS is scoped to the import page. Icons use existing `lucide-react`; controls/tables/modals/header reuse Ant Design and the shared PageHeader.

Primary actions use `#14b8a6` with `#0b1c30` text (measured 6.90:1); hover uses `#0f766e` with white (5.47:1). Dark text is required because white on the bright primary teal does not pass normal-text contrast. Secondary text uses `#526176` (6.31:1 on white; 5.72:1 on tinted panels). Font stacks request Plus Jakarta Sans/Inter and existing Khmer fallbacks; no external fonts or packages are added.

## Verification

Run `node node_modules/jest/bin/jest.js --config postman/item-import.jest.config.js --runInBand`.

Implementation checks: 25 tests passed across parser/validation and rendered page journeys. Targeted ESLint checks for undefined/unused variables, JSX/CSS parsing, and `git diff --check` passed. The full development webpack build passed with existing Browserslist-data and webpack hash deprecation warnings. No live import API was called. Responsive rules are implemented, but a real-browser visual review remains necessary.

Manual: open the import page from the Items button, download each template, upload Khmer CSV and multi-sheet Excel, select encoding/delimiter/header, resolve ambiguous mappings, test invalid amounts/formulas/duplicates, download review, confirm the final action stays unavailable, and test discard navigation and mobile layout. Server ingestion and persisted resume require the API above.
