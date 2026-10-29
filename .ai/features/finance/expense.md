Implement the **Expenses & Money Out → Monthly Bills & Rent** feature in my existing MarketChain ERP application, matching the attached screenshot closely.

**Scope: implement only the main page content. My application already has the sidebar and global header. Preserve and reuse them.**

Read DESIGN.md, UI_DESIGN_SYSTEM.md, frontend/backend rules, API conventions, and applicable project instructions first. Inspect existing expense, supplier/payee, branch, payment, approval, attachment, and recurring-job modules.

Reuse existing components, icons, forms, API clients, query caching, money/date utilities, permissions, and routing.

## Implementation files and folders

Use the following repository paths when implementing this feature. Keep changes scoped to the expense module and the integration points it requires.

### Primary implementation scope

| Path | Responsibility |
| --- | --- |
| `src/pages/Finance/Expense/` | Own the expense page content and its local components, forms, styles, state, and tests. |
| `src/pages/Finance/Expense/index.jsx` | Existing empty entry file: compose the page, reporting period, filters, tabs, summaries, recurring bills, timeline, WHT card, and invoice upload flow. |
| `src/layout/main-app.jsx` | Add the expense navigation entry under the existing Finance menu, respecting existing permission and menu conventions. Preserve the sidebar, global header, and unrelated navigation. |
| `src/router/index.js` | Register the expense page using the existing route and authorization patterns; keep its path consistent with the Finance menu link. |
| `src/services/` | Service layer referenced by `@service` in this task. The configured import alias is actually `@services/*` in `jsconfig.json`; use that existing alias. |
| `src/services/ExpenseService.js` (proposed) | Add an expense-specific service only after confirming the backend contract. Reuse the existing authenticated service client for supported expense, recurring commitment, cycle, payment, attachment, settings, and export operations. Split services only where existing contracts justify it. |

### Existing dependencies to inspect and reuse

- `src/services/BaseService.js` and `src/services/Core.js`: shared request, authentication, and service conventions.
- `src/services/VendorService.js`: existing vendor/payee integration; verify support for landlord records before reuse.
- `src/services/LocationService.js`: inspect location and authorized branch-scope support rather than assuming locations and shops are interchangeable.
- `src/services/PaymentMethodService.js`, `src/services/TaxService.js`, and `src/services/ExchangeRateService.js`: configured payment methods, tax data, and currency handling where their contracts support this flow.
- `src/services/PrivilegeService.js` and `src/helper/user.js`: inspect existing authorization helpers and privilege conventions.
- `src/components/`: reuse existing breadcrumb, card, table, button, select, date/month picker, loading, and upload components where suitable. Inspect `src/components/Upload/` before adding attachment handling.
- `src/helper/` and `src/components/stateless/monetary-value.jsx`: inspect existing money/date formatting and shared utilities before introducing new helpers.
- `src/app/modules/pos/services/report/IncomeExpenseService.js` and `src/app/modules/pos/services/transactions/IncomeExpenseCategoryService.js`: inspect legacy reporting/category behavior for compatibility; do not assume these services implement recurring bills or modify unrelated POS flows.

### Suggested expense-local organization

Create only the files needed after inspecting existing page conventions:

```text
src/pages/Finance/Expense/
  index.jsx
  expense.css
  components/       # Summary cards, tabs, filters, bills table, timeline, WHT, uploads
  form/             # Recurring bill and one-off expense forms, where not already available
  hooks/            # Shared period/filter scope and data loading, if needed
  utils/            # Pure schedule, status, and summary derivations, if needed
```

Place behavior tests beside the relevant module following the repository's existing test conventions. Cover period/filter changes, permissions, validation, real settlement states, and mutation error handling. Proposed files and folders above are implementation guidance, not claims that the workflows or backend endpoints already exist. Confirm missing backend dependencies before wiring operations; do not invent endpoints or successful responses.

## 1. Screenshot fidelity and layout

Treat the screenshot as the visual specification for:
- Content hierarchy.
- Labels and supporting text.
- Four summary cards.
- Expense navigation tabs.
- Filter toolbar and recurring-bills table.
- Upcoming rent timeline.
- Withholding-tax information card.
- Invoice upload strip.

Use real data instead of hardcoding reference amounts, dates, counts, or statuses.

Main content:
- Pale lavender-gray background, approximately #F8F9FF.
- White rounded cards with subtle borders.
- Dark navy headings.
- Muted slate-blue supporting text.
- Deep green primary actions.
- Mint active states.
- Pale blue table header/footer and neutral controls.
- Red due-soon indicators.
- Compact, readable spacing matching the reference.

The screenshot includes a narrow content area inside an application shell. Match the content proportions within the existing shell rather than shrinking the entire application or rebuilding it.

Use existing design-system fonts. Support Khmer and English.

## 2. Page breadcrumb and header

Breadcrumb:
**Finance › Expenses & Money Out › Fixed & Recurring Overhead**

Highlight the final segment in green.

Page title:
**Expenses & Money Out**

Description:
“Track daily store spending, recurring monthly bills, and petty cash across your shops with automatic lease reminders and VAT/WHT deductions.”

Right-side controls:
- Reporting-month selector with calendar icon.
  - Reference: October 2026.
- Small branch-status pill.
  - Reference: 9 BRANCHES ONLINE.
- Outlined **Payment Calendar** button.
- Outlined **Record Expense** button.
- Deep green **+ Add Recurring Bill** button.

Match the screenshot’s arrangement: month/status above the actions, with Add Recurring Bill beneath the secondary actions when space requires.

Behavior:
- Month selection updates the relevant reporting period consistently.
- Use authorized branches and the configured business timezone.
- Only claim branches are online if actual connectivity data exists; otherwise use an accurate branch-scope label.
- Payment Calendar opens a working calendar view of scheduled/due expenses.
- Record Expense opens the existing expense form, or implement it within the existing expense module.
- Add Recurring Bill opens the recurring-commitment form described below.

## 3. Expense navigation tabs

Display rounded tabs in this order:
1. All Expenses, with count.
2. Cash Drawers, with shop count and register icon.
3. Needs Approval, with a small red count badge.
4. Monthly Bills & Rent, with active count, recurring icon, and status dot.
5. Petty Cash Audit.

Selected tab:
**Monthly Bills & Rent (8 Active)** in the reference.

Selected styling:
- Mint background.
- Dark green text.
- Rounded corners.
- Green status dot.

Inactive styling:
- Pale blue-gray background.
- Muted text.

Connect to existing views. Preserve existing tabs beyond the crop. Use horizontal tab scrolling at narrow widths rather than clipping inaccessible controls.

## 4. Four summary cards

Four equal-width, equal-height cards on desktop. Two columns on tablet and one on mobile.

Use compact uppercase headings, prominent amounts, small icons/badges, and aligned bottom sections.

### A. Total Monthly Fixed Bills

Heading:
**TOTAL MONTHLY FIXED BILLS**

Reference:
- $6,450.00 / mo.
- “Across 8 verified shop commitments”.

Bottom:
- Horizontal stacked composition bar.
- Small legend:
  - Rent 65%.
  - Utils 20%.
  - Svc 15%.

Use actual recurring commitments and a documented monthly-equivalent calculation for nonmonthly schedules. Do not silently combine currencies.

Composition percentages must reconcile with the same total. Handle additional categories and zero totals.

### B. Upcoming Rent Due Soon

Heading:
**UPCOMING RENT DUE SOON**

Reference:
- Red badge: “2 Due < 7 Days”.
- $3,800.00 pending.
- “Sensok Hub (Nov 1) • Toul Kork (Nov 5)”.

Bottom pale blue callout:
- Bell icon.
- “Prevent lease penalty fees”.
- Green **Pay Now** action.

Define the due window clearly and calculate it in the business timezone. Reference values are not authoritative.

Pay Now opens the existing authorized payment/review flow. It must not mark a commitment paid merely because the button was clicked.

### C. Paid This Month

Heading:
**PAID THIS MONTH (OCT)**, adapting to selected month.

Reference:
- $5,250.00.
- Green secondary text: “75% Settled”.
- “6 of 8 commitments reconciled”.

Bottom:
- “Settlement Progress”.
- “6 / 8 Bills”.
- Green progress bar on a pale track.

Use actual payment allocations/reconciliation. Specify whether progress is based on bill count or amount, and label it consistently.

Do not equate generated drafts, submitted payments, and reconciled settlements.

### D. Auto-Generate Status

Heading:
**AUTO-GENERATE STATUS**

Reference:
- Mint badge: Active Engine.
- Main label: **Auto-Draft Ready**.
- Description:
  “Draft payment vouchers generated 5 days before landlord due dates.”
- Bottom:
  “Next batch: Nov 01 cycle”.
- Green **Settings** action with sliders icon.

Use actual scheduler configuration and next-run information. Do not claim an active engine unless implemented.

Settings opens configuration for supported generation/reminder behavior.

## 5. Recurring bills table card

White rounded container with:
1. Filter toolbar.
2. Pale blue table header.
3. Detailed bill rows.
4. Pale blue footer.

Keep table details readable. Use horizontal scrolling inside the table container when needed; do not hide content at the right edge to imitate screenshot cropping.

### Toolbar

Left:
- Search icon.
- Placeholder:
  “Search bill name, landlord, or contract ID…”

Then:
- Branch selector: **All Shops (9)**.
- Frequency selector: **Frequency: Monthly**.
- Status selector: **Status: All Active (8)**.
- Compact download/export icon button.

Use actual filter options and counts. Debounce search and reset pagination when filters change. Prevent stale responses after scope changes.

Export the authorized filtered scope using existing download conventions.

### Columns

1. BILL PURPOSE & CONTRACT.
2. LANDLORD / VENDOR PAYEE.
3. BRANCH SHOP.
4. AMOUNT / CYCLE.
5. NEXT DUE DATE.
6. METHOD.
7. STATUS.

### Bill purpose & contract

- Colored rounded icon tile on the left.
- Bold bill title.
- Smaller contract/reference details below.
- Different relevant icons for rent, internet, software, waste collection, and equipment.

### Landlord / vendor payee

- Payee name.
- Smaller account, tax ID, subscription, or contract information where authorized.
- Allow wrapping without overlapping adjacent columns.
- Follow existing masking rules for bank/account details.

### Branch shop

Compact pale blue pills:
- Sensok Hub.
- Toul Kork.
- BKK1 Main.
- All 9 Shops.
- Sensok • TK.

Use actual branch scope. Keep all-branch commitments distinct from explicit branch lists.

### Amount / cycle

- Bold right-aligned currency amount.
- Smaller schedule beneath.
- Optional accurate qualification:
  - Gross.
  - Net of WHT.
  - Per-shop allocation.

Do not treat gross contract amount and net landlord payment as interchangeable.

### Next due date

For unpaid upcoming bills:
- Date.
- Relative due text.
- Red warning icon/text when due soon or overdue.

For settled current-cycle bills:
- “Paid for Oct”.
- Smaller next scheduled due date.

Keep cycle settlement and next due date as separate data fields.

### Method

Small relevant icon plus wrapped text:
- ABA Transfer.
- Wing Bank.
- Auto Card Debit.
- Visa •4092.
- Cash / Collector.

Use existing configured methods. Do not expose full card numbers or payment credentials.

### Status

Compact dot-and-text pills:
- Pale red: Due Soon • Draft.
- Pale blue: Auto-Draft Ready.
- Mint: Paid Oct • Reconciled.
- Mint: Active • Auto-Debit.
- Mint: Active • Recurring.
- Pale blue: Scheduled.
- Mint: Paid Oct.

Derive labels from real states. Keep commitment status, voucher status, and payment status distinct even when combined visually.

## 6. Reference bill rows

Use these only as development fixtures for visual comparison:

1. Warehouse & Store Rent.
   - Contract #RNT-SK-2024-02 • 2 yr term.
   - Oknha Bunleng Real Estate.
   - Sensok Hub.
   - $1,800.00 monthly, gross.
   - Nov 01, 2026.
   - ABA Transfer.
   - Due Soon • Draft.

2. Retail Shop Lease — Ground Floor.
   - Contract #TK-ST-881 • Exp: Dec 2027.
   - Sokha Property Management.
   - Toul Kork.
   - $2,000.00 monthly, net of WHT.
   - Nov 05, 2026.
   - Wing Bank.
   - Auto-Draft Ready.

3. Flagship Storefront Lease.
   - Contract #BKK-01-V • 3 yr lease.
   - BKK Commercial Plaza Ltd.
   - BKK1 Main.
   - $1,200.00 monthly.
   - Paid for Oct; next Nov 15.
   - ABA Transfer.
   - Paid Oct • Reconciled.

4. Fiber Internet & Backup 4G SIMs.
   - Corporate Bundle (9 Active Routers).
   - Metfone Enterprise Services.
   - All 9 Shops.
   - $315.00 monthly; $35/shop.
   - Paid for Oct; next Nov 28.
   - Auto Card Debit.
   - Active • Auto-Debit.

5. POS & Multi-Shop Cloud Sync.
   - Enterprise Plan • 9 Registers + Hub.
   - MarketChain Cloud Ltd.
   - All 9 Shops.
   - $270.00 monthly.
   - Paid for Oct; next Nov 25.
   - Visa •4092.
   - Active • Recurring.

6. Commercial Trash & Waste.
   - Daily collection • 9 locations.
   - Cintri Waste Services / Gaea.
   - All 9 Shops.
   - $165.00 monthly.
   - Nov 12, 2026.
   - Cash / Collector.
   - Scheduled.

7. Refrigeration Equipment Lease.
   - 6× Display Chillers • Sensok + TK.
   - CoolTech Solutions KH.
   - Sensok • TK.
   - $700.00 monthly.
   - Paid for Oct; next Nov 20.
   - ABA Transfer.
   - Paid Oct.

Use real dates and data in production. Do not reproduce inconsistencies between reference totals, payment progress, due windows, and rows.

## 7. Table footer

Left:
- “Showing 7 of 8 recurring overhead commitments”.
- Small white badge: “1 Paused Contract Hidden”.

Right:
- **Previous Cycle**.
- **Next Cycle (Nov 2026)**.

Use actual totals and paused-filter state. Make the hidden-paused indication actionable where supported.

Cycle controls change the selected cycle consistently across the page. Do not duplicate recurring commitments when navigating periods.

Use existing pagination if more records exist.

## 8. Bottom-left: Upcoming Rent & Lease Timeline

White rounded card occupying approximately 58% of the lower desktop row.

Header:
- Green calendar/recurring icon.
- **Upcoming Rent & Lease Timeline**.
- Right micro-label: **Next 30 Days**.

Description:
“Pre-approved payment authorizations scheduled across shop landlords to avoid penalty lockouts.”

Adapt this wording when payments are not actually pre-approved.

Timeline:
- Thin pale blue vertical line.
- Circular event markers.
- Red urgency marker for the closest urgent event.
- Each event contains:
  - Bold commitment name.
  - Small relative-due or type badge.
  - Smaller payee and payment/contact information.
  - Right-aligned bold amount.
  - Smaller due date underneath.

Reference events:
- Sensok Hub Warehouse Lease — In 6 Days — $1,800.00 — Due Nov 01.
- Toul Kork Retail Lease — In 10 Days — $2,000.00 — Due Nov 05.
- Commercial Waste Collection — Routine — $165.00 — Due Nov 12.
- CoolTech Refrigerators (Chiller units) — Lease Installment — $700.00 — Due Nov 20.

Use actual unpaid scheduled obligations in the displayed rolling window. Clearly label the timeline’s independent “Next 30 Days” scope when the main report uses a selected month.

Bottom:
- Green link:
  **Export 30-Day Cash Flow Outflow (PDF) →**
- Right:
  **Total Next 30D: $4,665.00** in the reference.

Generate a real PDF through existing reporting utilities, or implement the export in the existing reporting module. Total must reconcile with included obligations and supported currency rules.

## 9. Bottom-right: SME withholding-tax card

Pale mint card occupying approximately 42% of the lower desktop row.

Header:
- Green badge/check icon.
- **SME Tip: Lease Withholding Tax (WHT)**.

Body explains that applicable lease payments may require withholding, according to the business’s configured tax treatment.

Reference white calculation panel:
- Gross Agreed Lease: $2,000.00.
- 10% WHT to GDT: -$200.00, red.
- Divider.
- Net Paid to Landlord: $1,800.00, green and bold.

Use configured tax rates and applicability. The screenshot’s 10% is a reference example, not a universal legal rule. Do not introduce blanket tax advice or silently apply this rate to every lease.

Preserve the distinction between:
- Gross-agreed contracts with deductions.
- Net-agreed contracts that may require gross-up.
- Tax withholding payable.
- Actual landlord payment.

Below:
“MarketChain auto-generates payment receipts with tax deduction breakdowns ready for your monthly GDT declaration.”

Use this statement only if supported; otherwise explain the actual available document workflow.

Actions:
- Deep green **View Lease Contracts & WHT Slips** button with document icon.
- Secondary **Configure WHT %** button.

Connect to working authorized views/settings.

## 10. Invoice upload strip

Below the tax card:
- Small white rounded horizontal card.
- Pale blue document-upload icon tile.
- Title: **Import Landlord Invoices**.
- Subtitle:
  “Drag PDF contracts, utility receipts or scans”.
- Right-side pale blue **Upload** button.

Reuse existing attachment upload/storage rules:
- Native picker and drag/drop.
- Actual supported formats and limits.
- Upload progress and errors.
- Link documents to the correct commitment or expense.
- Show a review/mapping step when association is ambiguous.
- Do not claim OCR extraction or automatic posting unless implemented.
- Uploading a document alone must not mark a bill paid.

## 11. Add Recurring Bill and expense operations

Reuse existing forms; implement missing workflows inside the existing expense module.

A recurring-bill form should support the fields required by this page:
- Bill purpose and expense category.
- Payee/vendor/landlord.
- Contract/reference and attachments.
- Authorized branch scope.
- Amount and currency.
- Gross/net tax treatment and applicable configured tax rules.
- Frequency and recurrence start/end.
- Due-day/date policy.
- Payment method.
- Reminder and draft-generation lead time.
- Active/paused status.

Follow existing validation and approval rules. Make any end-of-month due-date adjustment explicit.

Support existing permitted edit, pause/resume, detail, and payment operations through row/detail interactions without adding a visually conflicting action column.

Record Expense should use the current one-off expense flow and correctly refresh affected reports.

## 12. Recurrence, payments, and accounting

- Separate recurring commitments from generated cycle bills/vouchers and actual payment records.
- Make cycle generation idempotent so retries cannot create duplicate obligations.
- Handle paused contracts, end dates, and schedule changes without rewriting settled history.
- Use decimal money handling and existing rounding utilities.
- Reconcile paid totals from actual payment allocations.
- Support partial payments through existing rules.
- Do not count both the commitment and its generated bill as separate expenses.
- Prevent duplicate payment submission.
- Refresh affected summaries, table rows, and timeline after successful mutations.
- Enforce tenant, branch, role, and approval boundaries on the backend.

Do not fabricate successful saves, scheduled jobs, reconciliations, exports, or payments.

## 13. Responsive states and accessibility

- Four KPI columns on wide screens, two on tablet, one on mobile.
- Lower timeline/tax columns stack on narrow screens.
- Keep toolbar controls wrapping cleanly.
- Table scroll stays inside its container.
- Use loading skeletons, empty states, widget-level errors, and retry controls.
- Distinguish missing data from confirmed zero.
- Provide accessible labels, visible focus, and text alongside status colors.
- Preserve existing sidebar/global-header behavior.

## 14. Completion and visual verification

Implement the expense page content fully.

Compare against the screenshot:
- Breadcrumb, page title, description, month/status controls, and three actions.
- All five expense tabs.
- All four KPI cards and their bottom details.
- Search and filters.
- All seven table columns and detailed row formatting.
- Table footer and cycle navigation.
- Timeline, export link, and total.
- WHT card, calculation panel, and both actions.
- Invoice upload strip.

If browser preview is available, inspect the page within the existing application shell at desktop and mobile widths. Correct spacing, typography, card alignment, table density, and colors before finishing.

Report changed files, working operations, verification results, and exact remaining backend dependencies.
