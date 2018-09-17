import BaseService from "../BaseService";

class ReceivePurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase/receive";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ReceivePurchaseService();