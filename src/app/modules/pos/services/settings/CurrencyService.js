import BaseService from "../BaseService";

class CurrencyService extends BaseService {

  constructor() {
    super();
    this.module = "currency";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new CurrencyService();