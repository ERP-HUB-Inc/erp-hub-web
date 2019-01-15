import BaseService from "../BaseService";

class StockTransferService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/stock/transfer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new StockTransferService();