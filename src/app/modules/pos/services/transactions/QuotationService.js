import BaseService from "../BaseService";

class QuotationService extends BaseService {
  constructor() {
    super();
    this.module = "pos/quotation";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new QuotationService();