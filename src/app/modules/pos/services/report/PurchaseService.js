import BaseService from "../BaseService";

class PurchaseService extends BaseService {

  constructor() {
    super();
    this.module = "report/inventory/purchase";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new PurchaseService();