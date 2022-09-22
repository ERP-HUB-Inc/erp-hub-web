import BaseService from "../BaseService";

class AdjustmentService extends BaseService {
  constructor() {
    super();
    this.module = "report/stock";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getAdjustmentReport(option) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/adjustment?${this.bindQueryParam(option)}`,
      headers: this.header,
    });
  }

  exportProducts(option) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/exports?${this.bindQueryParam(option)}`,
      headers: this.header,
    });
  }
}

export default new AdjustmentService();
