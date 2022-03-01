import BaseService from "../BaseService";

class SaleService extends BaseService {

  constructor() {
    super();
    this.module = "report/sale";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getReportSummary(startDate, endDate) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summaries?startDate=${startDate}&endDate=${endDate}`,
      headers: this.header
    });
  }

  getReportSummaryByProduct(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_products?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  registers() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/registers`,
      headers: this.header
    });
  }

  registerDetail(date, userId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/registers/${date}?userId=${userId}`,
      headers: this.header
    });
  }
}

export default new SaleService();