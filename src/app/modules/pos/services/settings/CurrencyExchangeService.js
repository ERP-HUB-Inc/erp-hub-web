import BaseService from "../BaseService";

class CurrencyExchangeService extends BaseService {

  constructor() {
    super();
    this.module = "currency/exchange";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new CurrencyExchangeService();