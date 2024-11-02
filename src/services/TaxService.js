import BaseService from "./BaseService";

class TaxService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/taxes`;
    this.initializeRoute();
  }
}

export default new TaxService();