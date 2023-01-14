import BaseService from "../BaseService";

class QuotationService extends BaseService {
  constructor() {
    super();
    this.module = "pos/quotation";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  summary(filter) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/summary?filter=${filter}`,
      headers: this.header
    });
  }


  detail(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/detail/${id}`,
      headers: this.header
    });
  }

  getInvoiceByQuoteId(quoteId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/invoices/${quoteId}`,
      headers: this.header
    });
  }

  detailPublic(id, token) {
    this.header["Authorization"] = `Bearer ${token}`;
    return this.GET({
      url: `${this.baseUrl}/detail/${id}`,
      headers: this.header
    });
  }

  checkAvailableNo(number) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/check_available/${number}`,
      headers: this.header
    });
  }

  deleteQuotation(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/delete/${id}`,
      headers: this.header
    });
  }
}

export default new QuotationService();