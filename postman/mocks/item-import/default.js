const http = require("http");
// Contract-derived from pos-api ItemImportController/Service and docs/api/item-import.openapi.json.
// Additional scenario prefixes model read-only permission, row errors, stale revisions, and lost commit replies.
const fields = ["name", "barcode", "category", "cost", "price", "wholePrice", "distributePrice", "quantity", "unit"];
const required = ["name", "barcode", "cost", "price"];
const store = () => pm.state.get("item-import.store") || { sessions: {}, calls: [], sequence: 0, writes: 0 };
const save = value => pm.state.set("item-import.store", value);
const send = (res, status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
const fail = (res, status, code, message) => send(res, status, { error: { code, message, requestId: "fixture-request-id" } });
const readBody = async req => {
  if (req.body !== undefined) return typeof req.body === "string" && (req.headers["content-type"] || "").includes("application/json") ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  return (req.headers["content-type"] || "").includes("application/json") && raw ? JSON.parse(raw) : raw;
};
http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type,authorization,idempotency-key");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/_test/reset" && req.method === "POST") { save({ sessions: {}, calls: [], sequence: 0, writes: 0 }); return send(res, 200, {}); }
    if (url.pathname === "/_test/state") return send(res, 200, store());
    const match = url.pathname.match(/^\/(?:(readonly|invalid|stale|slow|failed|unavailable)\/)?items\/imports(?:\/(.*))?$/);
    if (!match) return fail(res, 501, "NOT_MODELED", "Endpoint not modeled");
    const scenario = match[1] || "normal", path = match[2] || "";
    const data = store();
    const body = await readBody(req);
    data.calls.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), body: typeof body === "object" && !Buffer.isBuffer(body) ? body : null, key: req.headers["idempotency-key"], contentType: req.headers["content-type"] });
    save(data);
    if (scenario === "unavailable") return fail(res, 503, "IMPORT_INTERNAL_ERROR", "Import request failed");
    if (path === "capabilities") return send(res, 200, {
      schemaVersion: "1", fields: fields.map(name => ({ name, required: required.includes(name), ...(name === "barcode" ? { maxLength: 20 } : {}) })),
      modes: ["create_only"], disabledModes: ["smart_upsert", "stock_only"], duplicatePolicies: ["reject", "skip"], fileDuplicatePolicies: ["reject", "keep_first", "keep_last"],
      requiredFields: { create_only: required }, limits: { uploadBytes: 26214400, dataRows: 10000, columns: 200 }, formats: ["xlsx", "xls", "csv", "tsv", "txt"], encodings: ["utf-8", "windows-1252"],
      currencies: [{ id: "currency-usd", code: "USD" }], decimalSeparators: [".", ","], groupingSeparators: [], maximumDecimalPlaces: 4, stockOperations: [], warehouses: [],
      retention: { sourceDays: 7, resultsDays: 30 }, actions: Object.fromEntries(["view", "upload", "configure", "validate", "commit", "discard"].map(key => [key, key === "view" || scenario !== "readonly"]))
    });
    if (scenario === "readonly" && req.method !== "GET") return fail(res, 403, "IMPORT_FORBIDDEN", "Item import permission denied");
    if (path === "templates") {
      // CSV path is real UTF-8 template content. XLSX fixture intentionally not modeled.
      if (url.searchParams.get("format") !== "csv") return fail(res, 501, "NOT_MODELED", "Use csv in this local fixture");
      res.writeHead(200, { "Content-Type": "text/csv;charset=utf-8" }); return res.end("\uFEFF" + fields.join(",") + "\r\n");
    }
    if (!path && req.method === "POST") {
      if (!(req.headers["content-type"] || "").includes("multipart/form-data; boundary=")) return fail(res, 400, "FILE_REQUIRED", "Use multipart field file");
      const id = `fixture-${++data.sequence}`;
      const settings = { worksheet: "Items", headerRow: 1, encoding: body && body.encoding || "utf-8", delimiter: body && body.delimiter || ",", mode: "create_only", duplicatePolicy: "reject", fileDuplicatePolicy: "reject", currencyId: "currency-usd", decimalSeparator: ".", mapping: {} };
      data.sessions[id] = { id, jobId: null, filename: "catalog.csv", mode: "create_only", importer: { id: "fixture-user", name: "Test Importer" }, state: "mapping_required", revision: 1, settings,
        validationId: null, worksheets: [{ name: "Items", rows: 3, columns: 9 }, { name: "Second", rows: 3, columns: 9 }], sourceRowCount: 2,
        progress: { processed: 0, total: 2 }, proposedCounts: null, committedCounts: { created: 0, updated: 0, skipped: 0, failed: 0 }, failure: null, resumeSupported: true,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), fileExpiresAt: new Date(Date.now() + 604800000).toISOString(), expiresAt: new Date(Date.now() + 2592000000).toISOString(), scenario };
      save(data); return send(res, 201, data.sessions[id]);
    }
    if (!path && req.method === "GET") {
      let sessions = Object.values(data.sessions).filter(s => !url.searchParams.get("search") || s.filename.includes(url.searchParams.get("search")) || s.id.includes(url.searchParams.get("search")) || s.importer.name.includes(url.searchParams.get("search")));
      const total = sessions.length, offset = Number(url.searchParams.get("offset") || 0), limit = Number(url.searchParams.get("limit") || 50);
      return send(res, 200, { data: sessions.slice(offset, offset + limit), total, limit, offset });
    }
    const parts = path.split("/"), session = data.sessions[parts[0]], action = parts[1];
    if (!session) return fail(res, 404, "IMPORT_NOT_FOUND", "Import not found");
    if (!action && req.method === "GET") {
      if (session.state === "queued") { session.state = session.scenario === "failed" ? "failed" : "completed"; session.failure = session.state === "failed" ? { code: "CATALOG_CHANGED", message: "Catalog changed after validation. No items were imported." } : null;
        session.committedCounts = { created: session.state === "completed" ? session.proposedCounts.create : 0, updated: 0, skipped: session.proposedCounts.skip, failed: session.state === "failed" ? session.proposedCounts.create : 0 }; session.progress.processed = session.state === "completed" ? session.sourceRowCount : 0; save(data); }
      return send(res, 200, session);
    }
    if (action === "preview") return send(res, 200, { worksheets: session.worksheets, worksheet: session.settings.worksheet, headerRow: session.settings.headerRow, headers: fields,
      data: [{ sourceRow: 1, cells: fields.map(value => ({ value })) }, { sourceRow: 2, cells: ["Coffee", "000012", "Beverages", "0", "2.50", "0", "0", "0", "Each"].map(value => ({ value })) }, { sourceRow: 3, cells: ["Tea", "000013", "Beverages", "1", "3", "0", "0", "0", "Each"].map(value => ({ value })) }], total: 3, limit: 50, offset: 0 });
    if (!action && req.method === "PATCH") {
      if (body.revision !== session.revision || scenario === "stale") return fail(res, 409, "STALE_IMPORT_REVISION", "Import settings have changed; reload the session");
      if (body.fileDuplicatePolicy && !["reject", "keep_first", "keep_last"].includes(body.fileDuplicatePolicy)) return fail(res, 400, "UNSUPPORTED_IMPORT_MODE", "Unsupported duplicate policy");
      const settings = { ...session.settings, ...body }; delete settings.revision;
      session.settings = settings; session.revision++; session.state = "mapping_required"; session.validationId = null; session.proposedCounts = null; save(data); return send(res, 200, session);
    }
    if (action === "validate" && req.method === "POST") {
      if (body.revision !== session.revision) return fail(res, 409, "STALE_IMPORT_REVISION", "Use current revision");
      if (required.some(field => !Number.isInteger(session.settings.mapping[field]))) return fail(res, 400, "MAPPING_REQUIRED", "Map required fields");
      session.validationId = `validation-${session.id}-${session.revision}`; session.state = scenario === "invalid" ? "validation_failed" : "ready_to_commit";
      session.proposedCounts = { create: scenario === "invalid" ? 1 : 2, update: 0, skip: 0, error: scenario === "invalid" ? 1 : 0 }; session.progress.processed = 2; save(data); return send(res, 200, session);
    }
    if (action === "rows") {
      let rows = [2, 3].map(sourceRow => ({ sourceRow, barcode: sourceRow === 2 ? "000012" : "000013", action: scenario === "invalid" && sourceRow === 2 ? "error" : "create", errors: scenario === "invalid" && sourceRow === 2 ? [{ field: "cost", code: "INVALID_NUMBER", message: "Use a non-negative amount with at most four decimal places" }] : [], warnings: [], proposedChanges: { name: sourceRow === 2 ? "Coffee" : "Tea", barcode: sourceRow === 2 ? "000012" : "000013", cost: "0", price: "2.50" } }));
      if (url.searchParams.get("action")) rows = rows.filter(row => row.action === url.searchParams.get("action"));
      return send(res, 200, { revision: session.revision, validationId: session.validationId, data: rows, total: rows.length, limit: 10, offset: 0 });
    }
    if (action === "commit" && req.method === "POST") {
      const key = req.headers["idempotency-key"], hash = JSON.stringify(body);
      if (!key) return fail(res, 400, "IDEMPOTENCY_KEY_REQUIRED", "Supply an Idempotency-Key");
      if (session.testKey) {
        if (session.testKey !== key || session.testBody !== hash) return fail(res, 409, "IDEMPOTENCY_KEY_REUSED", "Operation key belongs to a different request");
        return send(res, 202, session);
      }
      if (session.state !== "ready_to_commit" || body.revision !== session.revision || body.validationId !== session.validationId) return fail(res, 409, "VALIDATION_REQUIRED", "Validate unchanged revision");
      session.testKey = key; session.testBody = hash; session.state = "queued"; session.jobId = session.id; session.resumeSupported = false; session.progress.processed = 0; data.writes++; save(data);
      if (scenario === "slow") return setTimeout(() => send(res, 202, session), 400);
      return send(res, 202, session);
    }
    if (!action && req.method === "DELETE") {
      if (session.jobId || body.revision !== session.revision) return fail(res, 409, "IMPORT_NOT_EDITABLE", "Use current editable revision");
      session.state = "discarded"; session.resumeSupported = false; save(data); return send(res, 200, session);
    }
    return fail(res, 501, "NOT_MODELED", "Endpoint not modeled");
  } catch (error) { return fail(res, 500, "FIXTURE_ERROR", "Local fixture failed"); }
}).listen(process.env.PORT);
