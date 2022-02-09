import BaseService from "../BaseService";

class SaleService extends BaseService {

  constructor() {
    super();
    this.module = "report/sale";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  registers() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/registers`,
      headers: this.header
    });
  }

  registerDetail(date, userId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/registers/${date}?userId=${userId}`,
      headers: this.header
    });
  }
}

export default new SaleService();