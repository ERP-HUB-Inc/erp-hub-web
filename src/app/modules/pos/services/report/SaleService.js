import BaseService from "../BaseService";

class SaleService extends BaseService {

  constructor() {
    super();
    this.module = "report/sale";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getReportSummary(locationId, startDate, endDate, filterGroup = "") {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summaries?locationId=${locationId}&startDate=${startDate}&endDate=${endDate}&filterGroup=${filterGroup}`,
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

  getReportSummaryByCategory(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_categories?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }


  getReportSummaryByCashier(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_cashiers?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getReportSummaryByCustomer(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_customers?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getReportSummaryByLocation(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summary_by_locations?${this.bindQueryParam(option)}`,
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