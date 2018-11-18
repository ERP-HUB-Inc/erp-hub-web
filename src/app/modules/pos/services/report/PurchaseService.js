import BaseService from "../BaseService";

class PurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new PurchaseService();