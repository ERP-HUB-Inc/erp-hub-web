# Sales target integration

Contract source: user-provided `/sales-targets` examples and the adjacent
`pos-api/src/containers/sales/sales/controllers/SalesTargetController.ts`,
`services/SalesTargetService.ts`, and `models/SalesTarget.ts`.

The Settings screen lists numeric-ID targets with limit/offset pagination and
branch, period, year, and optional status filters. Status is omitted by default
so inactive records remain visible. Create and update send all seven editable
fields; monthly quarter is derived from month, quarterly month is null, and
yearly month/quarter are null. Disable sends comma-separated IDs and expects
`{success:true}`; it does not delete records.

Revenue validation accepts finite, nonnegative numbers. Years are whole calendar
years from 1 to 9999. No currency was specified, so the UI adds no currency symbol.

The inspected backend does not appear to apply business/user ownership checks to
sales target operations. The screen can list all branches by default or filter
by a branch, and loads branch choices through the standard `/locations` endpoint.
Backend ownership and authorization must be reviewed separately.

Verification uses local form, page-state, Settings navigation, and service request
option tests. It does not establish live HTTP behavior or backend authorization.
Run: `BABEL_ENV=test node node_modules/jest/bin/jest.js --config postman/sales-targets.jest.config.js --runInBand`.
