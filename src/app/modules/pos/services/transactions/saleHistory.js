import BaseService from "../BaseService";

class SaleHistoryService extends BaseService {

  constructor() {
    super();
    this.module = "currency";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new SaleHistoryService();