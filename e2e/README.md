# StoreVein browser E2E tests

This folder prepares Cypress tests for the frontend. The sibling
`erp-e2e-tests` project already uses Cypress; this project uses the same framework
in an isolated package so the legacy React build dependencies stay unchanged.
The initial version is pinned to 15.2.0 to match that project's declared baseline.

## Current status

- Implemented, not browser-verified: two login-page smoke checks, credential-to-dashboard
  login by click and Enter, session persistence after refresh, unauthenticated
  dashboard redirect, login helper, route map, and runner configuration.
- Planned: item management, purchase orders, Stock IO, retail POS, reports,
  permissions, and a purchase-to-sale journey. Specs without callbacks are
  intentionally pending; they are not completed coverage.
- Implemented, not browser-verified: category creation validation, required-only
  creation, optional details with explicit `isFeature: false`, request payload
  checks, and persisted list values after reload.
- Implemented, not browser-verified: cancel category deletion, archive a run-owned
  category, persist Archived status after reload, and show a real blocked-delete
  HTTP 409 before archiving a child and then its parent.
- Implemented, not browser-verified: create an Item Type, save it unchanged,
  assert the PUT response includes its ID, reload to verify persistence, and
  delete only the test-created record.
- Implemented, not browser-verified: create a Brand without a description,
  assert its Description cell stays blank, refresh the listing, and archive
  only the test-created Brand.
- Implemented, not browser-verified: create an Item Option, search, sort, change
  page size, refresh, update its description and status, verify persisted values,
  and delete only the option created by the test.
- No successful browser E2E run is recorded. The 2026-10-28 Item Type run
  aborted with `SIGABRT` before opening the test browser; it sent no application
  requests and created no records.

See [PLAN.md](./PLAN.md) for priorities, scenarios, prerequisites, and completion
criteria.

## Folder layout

```text
e2e/
  cypress.config.cjs
  package.json
  PLAN.md
  pages/                 Shared selectors and route helpers
  support/               Cypress commands and runner setup
  fixtures/              Synthetic data guidance; future builders
  specs/
    auth/                Login-page checks and authenticated login
    items/               Catalog and variant regressions
    item-types/          Item Type update and persistence
    item-options/        Item Option create, search, refresh, update, and delete
    brands/              Brand listing, refresh, and blank description
    categories/          Category creation, validation, and persistence
    purchasing/          Purchase orders and receiving
    stock-io/            Stock movements and quantity checks
    retail-pos/          Cart, discounts, checkout, receipt
    reports/             Sales and discount reconciliation
    permissions/         Role restrictions and direct URL access
    journeys/            Cross-module business workflows
```

## Local use

Start the frontend and its test backend using the existing development setup.
Then install this separate package once:

```sh
cd e2e
npm install
npx cypress install
```

The base URL defaults to `http://localhost:3000`, matching the frontend webpack
development port. To run just the login-page checks, no credentials are needed:

```sh
npm run test:smoke
```

### Local configuration inside this folder

Create your local settings file once:

```sh
cd e2e
cp config.example.json config.local.json
```

If your terminal is already in `e2e/`, run only the `cp` command. Edit
`e2e/config.local.json` and fill in your test workspace and credentials:

```json
{
  "baseUrl": "http://localhost:3000",
  "store": "your-test-workspace",
  "username": "your-test-username",
  "password": "your-test-password"
}
```

`config.local.json` is ignored by Git. The committed example contains no
credentials. The Node-side loader reads this file relative to its own directory,
so both `npm run test:auth` from `e2e/` and
`npm --prefix e2e run test:auth` from the project root use the same settings.
After editing the file, restart the Cypress process to reload settings.

Environment variables override matching local fields, which keeps CI compatible.
If you previously exported credentials and want to use only the local file:

```sh
unset E2E_BASE_URL E2E_STORE E2E_USERNAME E2E_PASSWORD
```

CI can continue to supply these values from its secret manager:

| Variable | Purpose |
| --- | --- |
| `E2E_BASE_URL` | Frontend URL; defaults to the local development URL |
| `E2E_STORE` | Test workspace/store identifier |
| `E2E_USERNAME` | Test account username |
| `E2E_PASSWORD` | Test account password |

Credentials are read by a Node task and typed with command logging disabled;
they are not copied into Cypress's browser configuration.
Do not add a `cypress.env.json` file containing credentials to Git. Screenshots
and downloads should contain only dedicated test-tenant data.

```sh
npm run test:auth
npm run test:categories
npm run test:item-types
npm run test:brands
npm run test:item-options
npm run open
npm test
```

The full run includes the authenticated login check and fails clearly when its
required credentials are absent from both configuration sources. Domain-specific scripts select the
prepared specs; those currently report pending scenarios.

### Category creation scenarios

Run `npm run test:categories` from `e2e/`, or
`npm --prefix e2e run test:categories` from the project root. Start the frontend
and backend first, and configure a dedicated test workspace with a non-cashier
account that can access the dashboard and create/read/update categories. Category
deletion uses the backend's existing inventory/product/update permission.

The spec opens New Category from the listing, verifies an empty name blocks
submission, then tests required-only creation and creation with Khmer name,
code, label, description, explicit Not featured status, Blue tile color, quick
access, and a 25% gross margin. It observes real create requests, checks the
confirmed payload and exclusion of preview-only fields, reloads the
listing, and searches for the persisted values returned by the backend.
It also creates a run-owned category, attempts the same name again, checks the
real `CATEGORY_NAME_EXISTS` response and inline name error, then corrects the
name and verifies a successful retry without losing the description.

Each successful creation uses a unique `E2E Category` name. The create spec creates
four records; retries can create more. Records are retained for inspection:
remove only those run-owned categories through the category listing's Delete
action after testing. No automatic cleanup or seed/reset endpoint is assumed.
Parent selection, image upload, save failures, and legacy modal creation are
not covered by this spec. No live backend responses are replaced.

### Category deletion scenarios

The same `test:categories` command also runs `delete-category.cy.js`. It creates
its own `E2E Delete` records, checks that Cancel sends no DELETE request, then
confirms deletion through the UI. The backend soft-archives records as `status: 3`
and retains them in the list; the spec asserts the Archived badge and persisted
status after reload rather than expecting the row to disappear.

The blocked-delete case creates a parent through the UI and sets up its child
through the real create API using the same authenticated test session, with
request logging disabled. This avoids depending on the create form's first 50
parent choices. It asserts HTTP 409 / `CATEGORY_DELETE_BLOCKED`, the visible
backend message, and unchanged parent status. It then archives the child and
parent through the UI. No delete response is stubbed and no pre-existing category
is deleted. A successful delete-spec run creates three records and leaves all
three archived. Failed runs can leave active fixtures for inspection.

### Item Type update scenario

Run `npm run test:item-types` from `e2e/`, or
`npm --prefix e2e run test:item-types` from the workspace root. Start the
frontend and backend with a dedicated test tenant and use an account with
catalog edit permission. The test creates a uniquely named Item Type through
the UI, opens that run-owned record for editing, saves every field unchanged,
checks that the PUT response returns the Item Type ID, reloads and verifies the
saved values, then permanently deletes only the record created by the test.
Requests and responses come from the configured backend; the test does not
stub API responses. A failed run can leave its `E2E Item Type` record for
inspection.

### Credential-to-dashboard scenarios

`npm run test:auth` runs the login-page smoke checks and these live auth scenarios:

1. Enter the configured workspace, username, and password, click submit, verify a
   non-empty `accessToken` in the saved session, and show the dashboard heading.
2. Submit the same form using Enter and verify the dashboard.
3. Sign in, refresh the page, and verify the session and dashboard persist.
4. Visit the dashboard without a session and verify the login redirect.

Use a non-cashier account in a workspace with completed onboarding and dashboard
access. The application sends cashiers to `/pos` and workspaces still being set
up to onboarding; these are not dashboard-success cases. Other specs can use
`cy.login({ expectedPath: routes.retailPOS })` for a cashier account when their
POS prerequisite checks are implemented.

The helper checks entered credential values using boolean assertions and does
not log passwords or token strings. It types through the actual form and does
not stub successful login or dashboard responses. A failed dashboard API/context
load must be investigated rather than bypassed by the test.

Tests run independently with `testIsolation: true`. No application server is
started by Cypress. Browser configuration follows the official
[Cypress configuration reference](https://docs.cypress.io/app/references/configuration).

## Output reports

After a normal headless run (`npm test`, `npm run test:smoke`, or another scoped
script), open `e2e/results/html/index.html` in a browser. Paths below are relative
to this folder:

| Output | Location | Contents |
| --- | --- | --- |
| Terminal | Command output | Spec results, totals, duration, and failing assertions |
| HTML | `results/html/index.html` | Combined spec report, test status, timings, assertion errors, and embedded failure screenshots |
| Raw JSON | `results/html/.jsons/*.json` | Per-spec machine-readable results retained for later processing |
| Screenshots | `screenshots/` | Failure captures, including failed retry attempts |
| JUnit XML, CI mode | `results/junit/results-*.xml` | Per-spec results for CI test dashboards |

The HTML report is self-contained and can be shared as one file. Passed, failed,
and pending cases remain distinguishable; the planned specs do not count as
implemented coverage. Failed retry screenshots are retained even when a later
attempt passes. Videos are disabled.

The normal reporter refreshes its `results/html/` output for each run. Archive
that folder and `screenshots/` as build artifacts if you need run history.
Generate reports using headless scripts; interactive `npm run open` is for
debugging, not a complete report run.

For CI systems that consume JUnit, choose this mode instead of the HTML reporter:

```sh
npm run test:ci
```

This mode produces XML and screenshots, without generating a new HTML report.
The `[hash]` filename prevents one spec from overwriting another. Use a clean
job workspace, and publish `results/junit/*.xml` plus screenshots even if tests
fail. Keep the test command's failure exit code so CI fails when tests fail.
An HTML file left from an earlier run is not the current CI result.

These outputs require installing the package dependencies first. No output
report exists until tests actually run, and a startup/configuration failure may
occur before any report is produced.

HTML and screenshot integration follows the
[Mochawesome reporter setup](https://github.com/LironEr/cypress-mochawesome-reporter/tree/v3).
Version 3.8.4 supports the project's observed Node 20 runtime; newer reporter
major versions require Node 22. JUnit configuration follows the
[Cypress reporter documentation](https://docs.cypress.io/app/tooling/reporters).

## Adding a scenario

1. Implement a pending scenario with its own run-owned data and prerequisites.
2. Use the existing UI for the business action being tested. Observe real
   requests for payload assertions without replacing responses in a live E2E run.
3. Assert visible behavior, persisted values after reload, and related stock or
   transaction effects where relevant.
4. Use stable input IDs, accessible controls, or deliberate `data-testid`
   attributes. Add selectors only to the component being covered.
5. Wait for meaningful requests or visible state, never a fixed sleep. Do not
   suppress application exceptions to make tests pass.
6. Document required roles, data ownership, supported cleanup, and any backend
   dependency. Keep mocked failure tests separate from live workflow coverage.

Capture test results and failure screenshots in ignored output folders. CI setup,
seed/reset APIs, additional role credentials, and complete domain page helpers
are later phases, not implied by this scaffold.
