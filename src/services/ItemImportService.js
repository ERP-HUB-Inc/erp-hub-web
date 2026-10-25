import BaseService from "./BaseService";

/** Persisted import sessions. All writes use the shared authenticated Axios client. */
export class ItemImportService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/items/imports`;
    this.timeout = 60000;
  }

  async request(method, path = "", options = {}) {
    this.setHeader();
    const response = await this.POST({
      method,
      url: `${this.baseUrl}${path}`,
      timeout: this.timeout,
      ...options,
      headers: { ...this.header, ...options.headers }
    });
    return response.data;
  }

  capabilities() { return this.request("GET", "/capabilities"); }
  upload(file, encoding, delimiter, onUploadProgress) {
    const data = new FormData();
    data.append("file", file);
    data.append("encoding", encoding);
    data.append("delimiter", delimiter);
    // Axios/browser supplies the multipart boundary. Do not copy the JSON header.
    return this.request("POST", "", { data, headers: { "Content-Type": undefined }, onUploadProgress });
  }
  session(id) { return this.request("GET", `/${encodeURIComponent(id)}`); }
  preview(id, params = {}) { return this.request("GET", `/${encodeURIComponent(id)}/preview`, { params: { limit: 50, offset: 0, ...params } }); }
  configure(id, data) { return this.request("PATCH", `/${encodeURIComponent(id)}`, { data }); }
  validate(id, revision) { return this.request("POST", `/${encodeURIComponent(id)}/validate`, { data: { revision } }); }
  rows(id, params = {}) { return this.request("GET", `/${encodeURIComponent(id)}/rows`, { params: { limit: 10, offset: 0, ...params } }); }
  groups(id, params = {}) { return this.request("GET", `/${encodeURIComponent(id)}/groups`, { params: { limit: 10, offset: 0, variantLimit: 50, variantOffset: 0, ...params } }); }
  commit(id, revision, validationId) {
    return this.request("POST", `/${encodeURIComponent(id)}/commit`, {
      data: { revision, validationId },
      headers: { "Idempotency-Key": `item-import-${id}-${validationId}` }
    });
  }
  history(params = {}) { return this.request("GET", "", { params: { lastDays: 7, limit: 10, offset: 0, ...params } }); }
  discard(id, revision) { return this.request("DELETE", `/${encodeURIComponent(id)}`, { data: { revision } }); }
  template(format) { return this.request("GET", "/templates", { params: { format, mode: "create_only" }, responseType: "blob" }); }
  report(id) { return this.request("GET", `/${encodeURIComponent(id)}/report`, { params: { format: "xlsx" }, responseType: "blob" }); }
}

export async function importFailure(error) {
  let data = error && error.response && error.response.data;
  if (typeof Blob !== "undefined" && data instanceof Blob && typeof data.text === "function") {
    try { data = JSON.parse(await data.text()); } catch (ignored) { data = null; }
  }
  const detail = data && data.error;
  return {
    message: detail && typeof detail.message === "string" ? detail.message : "Unable to complete this request. Your saved session has been preserved. Please try again.",
    code: detail && detail.code,
    requestId: detail && detail.requestId,
    status: error && error.response && error.response.status
  };
}

export default new ItemImportService();
