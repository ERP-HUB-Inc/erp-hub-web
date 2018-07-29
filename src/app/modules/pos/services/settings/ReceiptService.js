import BaseService from "../BaseService";

class ReceiptService extends BaseService {

  constructor() {
    super();
    this.module = "receipt-template";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ReceiptService();