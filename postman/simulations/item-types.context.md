# Item Type frontend simulation

## Purpose

Run the real Settings Item Type page and service over HTTP against the local mock in `../mocks/item-types/default.js`. Its contract comes from the adjacent backend source and shared Item Type handoff; no remote owner mock was searched or published because the contract is available locally.

## Execution

Start: `postman simulation run postman/simulations/item-types.sim.yaml --port 4922 --output ndjson --no-history`.

Test: `ITEM_TYPES_SIM_URL=http://127.0.0.1:4922/catalog node node_modules/jest/bin/jest.js --config postman/item-types.jest.config.js --runInBand`.

## Assumptions

- 2026-10-27 (source review): response shapes follow the current working-tree ItemTypeController/service/base repository. Database/auth/tenant guarantees are not established by this mock. Failure prefixes deliberately model API errors and missing bodies for frontend resilience.
- 2026-10-27: jsdom tests use real Ant Design controls, service code, and Axios HTTP when the simulation variable is set. They do not establish browser layout or real-backend compatibility.

## Observations

2026-10-27: `postman simulation run` exited with code 1 before listening; the catalog member served no traffic. Five HTTP tests remain skipped without `ITEM_TYPES_SIM_URL`. The separate UI/form test run passed 29 tests; it does not establish HTTP behavior.
2026-10-28: Retry had the same `listen EPERM` startup failure. No catalog traffic was served; the five HTTP integration tests remain unverified.

## What didn't work

2026-10-27: local startup failed with `listen EPERM: operation not permitted 127.0.0.1` under the filesystem/network sandbox. No elevated execution was requested; rerun the commands above in an environment permitting local listeners.
2026-10-28: retry confirmed the loopback listener restriction remains.
