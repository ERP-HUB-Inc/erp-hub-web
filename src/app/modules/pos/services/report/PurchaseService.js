import BaseService from "../BaseService";

class PurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "report/purchases";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getReportSummary(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summaries?${this.bindQueryParam(option)}`,
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

  getReportSummaryBySupplier(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_suppliers?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }
}

export default new PurchaseService();