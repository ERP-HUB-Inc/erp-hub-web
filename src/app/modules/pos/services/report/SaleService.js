import BaseService from "../BaseService";

class SaleService extends BaseService {

  constructor() {
    super();
    this.module = "income/expense/sale";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new SaleService();