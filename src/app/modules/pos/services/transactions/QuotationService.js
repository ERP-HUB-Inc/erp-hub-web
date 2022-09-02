import BaseService from "../BaseService";

class QuotationService extends BaseService {
  constructor() {
    super();
    this.module = "pos/quotation";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  detail2(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/detailV2/${id}`,
      headers: this.header
    });
  }

  detailPublic(id, token) {
    this.header["Authorization"] = `Bearer ${token}`;
    return this.GET({
      url: `${this.baseUrl}/detailV2/${id}`,
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