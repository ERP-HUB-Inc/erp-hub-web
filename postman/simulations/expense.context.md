# Expense simulation — 2026-10-29

## Purpose
Local frontend verification against the existing expense controller/service and duplicate-confirmation contract. The owning API is the adjacent pos-api checkout; the mock was built from its source rather than searched in an external workspace. It does not model future payment or commitment capabilities.

## Execution
From pos/:
```sh
postman simulation run postman/simulations/expense.sim.yaml --port 4921 --no-history --output ndjson
EXPENSE_SIM_URL=http://127.0.0.1:4921/finance BABEL_ENV=test node node_modules/jest/bin/jest.js --config postman/expense.jest.config.js --runInBand
```
The integration suite uses real ExpenseService HTTP requests and rendered forms. It skips when EXPENSE_SIM_URL is absent; skipped tests are not integration evidence. Stop the server with Ctrl+C.

## Assumptions
- 2026-10-29: local listening sockets are required. Current sandbox rejects bind; run in a local environment that permits loopback. Seed values are synthetic; no tenant/role enforcement, multipart uploads, persisted database behavior or business timezone configuration is established by this simulation.

## Observations
<!-- begin:observations -->
- 2026-10-29: the only member, expense, served no traffic because server startup was denied. HTTP suite remains unverified.
<!-- end:observations -->

## What didn't work
- 2026-10-29: `postman simulation run` exited with `listen EPERM: operation not permitted 127.0.0.1` before emitting a listening event. No HTTP evidence was produced; no external publication or credentials were used.
