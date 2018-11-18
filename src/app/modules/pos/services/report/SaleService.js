import BaseService from "../BaseService";

class SaleService extends BaseService {

  constructor() {
    super();
    this.module = "report/sale";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new SaleService();