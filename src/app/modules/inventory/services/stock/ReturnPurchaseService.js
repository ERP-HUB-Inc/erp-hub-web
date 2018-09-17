import BaseService from "../BaseService";

class ReturnPurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase/return";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ReturnPurchaseService();