import BaseService from "../BaseService";

class StockService extends BaseService {
  constructor() {
    super();
    this.module = "report/stock";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getStockReport(option) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/lists?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  exportStockReport(option) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/exports?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }
}

export default new StockService();
