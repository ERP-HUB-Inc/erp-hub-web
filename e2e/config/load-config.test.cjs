const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test, beforeEach, afterEach } = require("node:test");
const { loadConfig } = require("./load-config.cjs");

let directory;
let filename;
const localValues = { baseUrl: "http://localhost:3100", store: "test-workspace", username: "test-user", password: "synthetic-password" };
beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), "storevein-e2e-config-"));
  filename = path.join(directory, "config.local.json");
});
afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

test("smoke configuration works without a local file or credentials", () => {
  const config = loadConfig({}, filename);
  assert.equal(config.baseUrl, "http://localhost:3000");
  assert.throws(() => config.getLoginCredentials(), /Set store, username, password/);
});

test("reads URL and credentials from the local file without adding credentials to config", () => {
  fs.writeFileSync(filename, JSON.stringify(localValues));
  const config = loadConfig({}, filename);
  assert.equal(config.baseUrl, localValues.baseUrl);
  assert.deepEqual(config.getLoginCredentials(), { store: localValues.store, username: localValues.username, password: localValues.password });
  assert.deepEqual(Object.keys(config), ["baseUrl", "getLoginCredentials"]);
});

test("environment values override local settings independently", () => {
  fs.writeFileSync(filename, JSON.stringify(localValues));
  const config = loadConfig({ E2E_BASE_URL: "http://localhost:3200", E2E_PASSWORD: "synthetic-ci-password" }, filename);
  assert.equal(config.baseUrl, "http://localhost:3200");
  assert.deepEqual(config.getLoginCredentials(), { store: localValues.store, username: localValues.username, password: "synthetic-ci-password" });
});

test("missing credential errors list fields without exposing configured values", () => {
  fs.writeFileSync(filename, JSON.stringify({ store: localValues.store }));
  assert.throws(() => loadConfig({}, filename).getLoginCredentials(), error => {
    assert.match(error.message, /Set username, password/);
    assert.equal(error.message.includes(localValues.store), false);
    return true;
  });
});

test("malformed JSON errors do not include file content", () => {
  fs.writeFileSync(filename, 'broken-json-with-synthetic-password');
  assert.throws(() => loadConfig({}, filename), error => {
    assert.match(error.message, /JSON syntax/);
    assert.equal(error.message.includes("synthetic-password"), false);
    return true;
  });
});

test("rejects non-object configuration", () => {
  fs.writeFileSync(filename, "[]");
  assert.throws(() => loadConfig({}, filename), /JSON object/);
});

test("rejects numeric passwords instead of changing the entered credential", () => {
  fs.writeFileSync(filename, JSON.stringify({ ...localValues, password: 12345 }));
  assert.throws(() => loadConfig({}, filename), /password setting must be a string/);
});
