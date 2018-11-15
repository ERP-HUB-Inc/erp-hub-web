import BaseService from "../BaseService";

class ReceiptTemplateService extends BaseService {

  constructor() {
    super();
    this.module = "receipt-template";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  default() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/default`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new ReceiptTemplateService();