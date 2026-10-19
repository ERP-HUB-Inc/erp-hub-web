# Report record-filter verification

The local simulation uses synthetic records to verify location/vendor selects
against the real services and Axios client over HTTP. Ant Design controls are
represented by simple test controls; this does not verify browser layout.

Fixtures follow the list envelope (`data: [...]`), detail envelope
(`data: { id, name }`), and GET paths used by the existing service clients.
They are frontend-derived assumptions, not an independently verified backend
contract. No owner workspace mock was searched or published; these fixtures
are local to this UI change. Verify live response compatibility before release.

Start the simulation in one terminal:

```sh
postman simulation run postman/simulations/report-records.sim.yaml --port 4908 --no-history
```

Run the focused report tests and HTTP integration checks in another terminal:

```sh
REPORT_RECORDS_SIM_URL=http://127.0.0.1:4908/records node node_modules/jest/bin/jest.js --config postman/report-records.jest.config.js --runInBand
```

Without `REPORT_RECORDS_SIM_URL`, the HTTP checks are skipped. The remaining
report tests still run. Stop the simulation with Ctrl+C when finished.

Covered flows: search outside the initial result page, selected-label retention,
clearing filters, URL-restored selections, search failures and recovery, stale
response handling, table search, local pagination, and report filter scope.
