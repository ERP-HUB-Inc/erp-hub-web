# Category image simulation

## Purpose

Local upload/delete and image fixtures based on the adjacent pos-api FileController/FileStorage implementation. See ../mocks/category-image/default.js. No remote workspace mock was pulled; the adjacent implementation supplied the response contract.

## Execution

Start with `CATEGORY_UPLOAD_SIM_ORIGIN=http://127.0.0.1:4918 postman simulation run postman/simulations/category-image.sim.yaml --port 4918 --output ndjson --no-history`.
Run form.create.upload.integration.test.jsx with `CATEGORY_UPLOAD_SIM_URL=http://127.0.0.1:4918/uploads` and the category Jest configuration. Without that variable only the mounted form rendering check runs.

## Assumptions

2026-10-27: Response fields follow the local backend checkout; the deployed API response remains unverified. The mock does not validate authentication or image contents. The mounted test simulates browser image decoding because jsdom does not decode pixels. HTTP image retrieval uses the simulation member prefix; production previews use REACT_APP_RESOURCE_HOST.

## Observations

<!-- begin:observations -->
2026-10-27: No successful HTTP run recorded; the upload member could not start in the sandbox. Unit checks do not establish server connectivity.
<!-- end:observations -->

## What didn't work

2026-10-27: Local server startup failed with EPERM while binding localhost. The requested elevated run was interrupted. The subsequent HTTP check had no running server and did not establish upload behavior.
