import BaseService from "./BaseService";

class LogService extends BaseService {
  constructor() {
    super();
    this.logBaseUrl = `${this.baseUrl}/logs/v1`;
  }

  getSystemLogs(params) {
    this.setHeader();
    return this.GET({
      url: `${this.logBaseUrl}/system`,
      params,
      headers: this.header
    });
  }

  getActivities(params) {
    this.setHeader();
    return this.GET({
      url: `${this.logBaseUrl}/activities`,
      params,
      headers: this.header
    });
  }

  previewCleanup(params) {
    this.setHeader();
    return this.GET({
      url: `${this.logBaseUrl}/files/cleanup-preview`,
      params,
      headers: this.header
    });
  }

  deleteFiles(params) {
    this.setHeader();
    return this.DELETE({
      url: `${this.logBaseUrl}/files`,
      params,
      headers: this.header
    });
  }
}

export default new LogService();
