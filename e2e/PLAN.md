# E2E implementation plan

## Scope and approach

Build browser coverage around business outcomes: sign in, manage items, order and
receive stock, sell through POS, and reconcile quantities and financial reports.
Keep the existing Jest unit tests; E2E tests cover integration and persistence
that those tests cannot establish.

Use Cypress, consistent with the existing sibling E2E project. This folder is an
independent package. No frontend package, environment file, application behavior,
or sibling project is changed as part of preparation.

## Phase 1 — runner and authentication

Prepared: package, config, route map, login helper, initial login specs, and domain
backlog files. HTML reporting with embedded failure screenshots, retained raw
JSON, and an alternative JUnit CI mode are configured. First run the smoke checks against a dedicated environment, verify
the authenticated check, and commit the generated dependency lockfile after
installation.

Add invalid credentials, denied store access, logout, expired session, protected
URL redirects, and role-dependent landing pages. Validate persistence after
refresh. Introduce cached sessions only after UI login is proven, and validate
each cached session before reuse.

Completion: smoke and authentication tests run independently, no credentials or
tokens appear in logs, and failures identify the failing user action.

## Phase 2 — item management

Added Item Type regression coverage in `specs/item-types/update-item-type.cy.js`:
create a run-owned Item Type, submit an unchanged update, assert the response
contains its ID, verify persistence after reload, and clean up that record.
Browser execution requires the dedicated test workspace and backend.

Added Brand listing coverage in `specs/brands/brand-listing.cy.js`: create a
run-owned Brand without a description, verify the Description cell stays blank,
exercise Refresh, and archive only that Brand. Run with `npm run test:brands`
from `e2e/`. Browser execution requires a dedicated test workspace and an
account with catalog edit permission.

Added Item Option coverage in `specs/item-options/item-option-crud.cy.js`:
create a unique option, find it by backend search, check sorting and page-size
requests, refresh the filtered list, change its description and status, verify
persistence, then delete only the test-created record. Run with
`npm run test:item-options` from `e2e/`. Use an
authenticated test account with catalog edit permission and a disposable tenant.

| Priority | Scenario | Required evidence |
| --- | --- | --- |
| P0 | Create standard item | Required validation, successful save, reload persisted item |
| P0 | Create variant item | Correct names, prices, SKU/barcode uniqueness, IDs returned by backend |
| P0 | Update without opening Variants | No collection error; omitted variant fields preserve variants, minimum price, and status |
| P0 | Add variant and save | String field validation passes; temporary table key omitted from API variant ID |
| P0 | Edit then collapse | Edited values still persist after save and reload |
| P0 | Delete existing variant | Availability check succeeds; Save sends exactly one `{ id, status: 3 }`; reload confirms archive |
| P0 | Blocked variant deletion | Exact backend message shown; row and quantity unchanged |
| P0 | Delete across search/page changes | Pending archived IDs survive and are sent on Save |
| P1 | Remove unsaved row | No backend delete request or archived record created |
| P1 | Out-of-stock tab | `outOfStock=true`, summary badge, zero badge, filter reset on tab change |
| P1 | Filters and pagination | Search, category, location, limits, loading, empty, error, refresh |
| P1 | Cancel edit | No item update or variant archive is persisted |

Confirm the backend supports partial updates with omitted variants before
enabling that regression test. See
[item update backend requirements](../.ai/features/item-update-variants.md).

## Phase 3 — purchasing and Stock IO

| Area | Priority | Coverage |
| --- | --- | --- |
| Purchase order | P0 | Supplier, location, item lines, quantity/cost totals, save/reload |
| Purchase validation | P0 | Required fields, invalid quantity/cost, date and time boundaries |
| Receiving | P0 | Supported partial/full receiving, outstanding quantity, linked movement |
| Stock in | P0 | Quantity delta and persisted movement history for the selected location |
| Stock out | P0 | Supported movement, quantity delta, configured insufficient-stock policy |
| Duplicate submit | P0 | Exactly one order/receipt/movement from repeated clicks |
| API rejection | P1 | Useful error, inputs retained, no partial inventory mutation |
| Editing/cancellation | P1 | Only supported lifecycle transitions; correct reversal effects |
| Import | P2 | Local mapping/validation and supported backend commit workflow |

Before implementing state transitions, inspect the current order and movement
forms and backend contracts. Document what draft, receive, cancel, edit, and
stock-out operations actually support. Receiving may create Stock IO itself;
do not count the same receipt as two separate inventory increases.

## Phase 4 — retail POS

| Priority | Scenario | Required evidence |
| --- | --- | --- |
| P0 | Register/shift prerequisites | Correct register/location; shift workflow when required |
| P0 | Product lookup | Name/barcode search, variant choice, correct selling price |
| P0 | Cart editing | Add/remove, quantities, totals update accurately |
| P0 | Discount | Permitted line/order discounts, validation, correct persisted totals |
| P0 | Cash checkout | Payment succeeds, receipt ID exists, stock deducted exactly once |
| P0 | Duplicate payment | One transaction and one inventory effect |
| P0 | Payment failure | Clear error; no falsely completed sale or stock deduction |
| P1 | Tender and change | Decimal currency precision, tax, rounding, correct change |
| P1 | Availability | Configured out-of-stock policy and concurrent quantity changes |
| P1 | Permissions | Cashier price/discount/action limits remain enforced |
| P2 | Other payment types, returns, hold/resume | Add only for enabled product workflows |

For money, compare using the configured currency precision rather than raw
floating-point equality. Do not assume negative stock, tax, discount limits, or
shift requirements; derive them from the test tenant's settings and contracts.

## Phase 5 — reports and cross-module journey

Verify Sales Report date/location filters, discount summary, trend and item
discount columns, zero/missing display, and unchanged API revenue values.
Reconcile one known sale and its quantities against report data for that location
and period. Cover report loading, empty results, API errors, and denied access.

Create a dedicated journey that performs its own setup in one test:

1. Create an item with a known starting quantity and price.
2. Create a purchase order and receive a known quantity through the supported flow.
3. Verify the receipt's movement and updated on-hand quantity once.
4. Complete a retail sale for a smaller quantity.
5. Reload item stock and verify starting stock + receipts - sold quantity.
6. Verify the sale receipt, discount, and corresponding report entries.
7. Apply supported cleanup/reversal for run-owned data or retain it in the disposable tenant.

Do not chain independent spec files or depend on their execution order. Individual
module specs create their own prerequisites; the journey is an additional test.
Use a bounded request/state check for asynchronous report updates.

## Phase 6 — CI and expanded coverage

After scenarios work locally, run login smoke checks on pull requests against an
available preview environment. Add authenticated and transactional checks when
dedicated accounts, seed/reset support, and isolated test data exist. Run broader
regression coverage nightly and before releases.

Verify HTML generation on a passing run and on a deliberately failing local
check, then remove the deliberate failure. Verify CI ingests every per-spec
JUnit file. Publish test totals with passed, failed, pending, and retried counts. Retain
failure artifacts; never report pending specs as implemented coverage. Begin
transactional runs with one worker; add parallelism only after each worker has
isolated data and registers. Add tablet/mobile viewports to critical POS flows.

## Shared data and environment prerequisites

- Dedicated test tenant, location, supplier, cash register, and supported tax/currency settings.
- Admin or inventory account, purchasing account, cashier, and a deliberately restricted account.
- Unique run/worker/retry prefixes; deterministic item quantities and costs.
- A backend-supported data setup and cleanup contract; no guessed reset endpoints.
- A reachable frontend/backend and any enabled payment dependencies.
- Known timezone for date filters and date/time validation cases.

Keep role sessions separate. Capture only synthetic data in fixtures and browser
artifacts. An API failure simulation can establish error-path behavior; it does
not establish that a live purchasing/payment transaction works.

## Definition of done for each implemented scenario

- Named prerequisite, role, action, expected result, and cleanup strategy.
- Works alone from an isolated browser context and known test data.
- Asserts a meaningful visible result and persistence after reload when writing data.
- Checks the actual request payload where the regression concerns omitted fields,
  archived IDs, duplicates, or filters; does not stub the business action's success.
- Waits for a request or observable UI state, without arbitrary delays.
- Preserves authentication, permissions, validation, and error reporting.
- Documents live versus simulated evidence and remaining backend dependencies.
