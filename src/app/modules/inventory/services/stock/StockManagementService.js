import BaseService from "../BaseService";

class StockManagementService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/supplier";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new StockManagementService();