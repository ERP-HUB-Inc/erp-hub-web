const fs = require("node:fs");
const path = require("node:path");

function loadConfig(environment = process.env, filename = path.join(__dirname, "..", "config.local.json")) {
  let local = {};
  if (fs.existsSync(filename)) {
    try {
      local = JSON.parse(fs.readFileSync(filename, "utf8"));
    } catch {
      // Do not include the parser error: it can contain credential text.
      throw new Error("Unable to read e2e/config.local.json. Check its permissions and JSON syntax.");
    }
    if (!local || typeof local !== "object" || Array.isArray(local)) {
      throw new Error("e2e/config.local.json must contain a JSON object.");
    }
  }

  const resolve = (key, variable, fallback = "") => {
    const value = environment[variable] ?? local[key] ?? fallback;
    if (typeof value !== "string") {
      throw new Error(`The ${key} setting must be a string in e2e/config.local.json or ${variable}.`);
    }
    return value;
  };
  const baseUrl = resolve("baseUrl", "E2E_BASE_URL", "http://localhost:3000");
  const credentials = {
    store: resolve("store", "E2E_STORE"),
    username: resolve("username", "E2E_USERNAME"),
    password: resolve("password", "E2E_PASSWORD")
  };

  return {
    baseUrl,
    getLoginCredentials() {
      const missing = Object.keys(credentials).filter(key => !credentials[key]);
      if (missing.length) {
        throw new Error(`Set ${missing.join(", ")} in e2e/config.local.json or the corresponding E2E_STORE, E2E_USERNAME, E2E_PASSWORD variables before authenticated tests.`);
      }
      return { ...credentials };
    }
  };
}

module.exports = { loadConfig };
