# Sidebar health checks

The healthy fixture models the consumed `status: "ok"` field observed from the
user-provided local health endpoint (HTTP 200). Other payload fields are neither
required nor displayed. Error, unrecognized, and delayed responses are synthetic
resilience fixtures. No external workspace mock was needed or published.

Run the local simulation:

```sh
postman simulation run postman/simulations/sidebar-health.sim.yaml --port 4909 --no-history
```

In a second terminal, run the sidebar tests with actual service/client HTTP calls:

```sh
SIDEBAR_HEALTH_SIM_URL=http://127.0.0.1:4909/health-checks node node_modules/jest/bin/jest.js --config postman/sidebar-health.jest.config.js --runInBand
```

Stop the server with Ctrl+C afterward. Without `SIDEBAR_HEALTH_SIM_URL`, the HTTP
checks are skipped. Test controls replace only the tooltip; no HTTP client is
stubbed. The simulation validates local UI/service integration, not production
availability, authentication policy, or browser CORS configuration.
