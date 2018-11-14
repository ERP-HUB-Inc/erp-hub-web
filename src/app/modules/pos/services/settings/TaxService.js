import BaseService from "../BaseService";

class TaxService extends BaseService {

  constructor() {
    super();
    this.module = "tax";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new TaxService();