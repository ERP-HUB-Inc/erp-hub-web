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

  getPurchaseSummary(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/summary?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchaseTrend(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/trend?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchaseProducts(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/products?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchaseSuppliers(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/suppliers?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchasePriceIncrease(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/intelligence/price-increase?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchaseOverstock(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/intelligence/overstock?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  getPurchaseVsSales(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/purchases/intelligence/purchase-vs-sales?${this.bindQueryParam(option)}`,
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
