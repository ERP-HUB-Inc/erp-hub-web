import BaseService from "../BaseService";

class CurrencyExchangeService extends BaseService {

  constructor() {
    super();
    this.module = "currency/exchange";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getExchangeRate(
      filter, // {"column1": [value1, value2], "column2": [value1, value2]}
  ) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/lists?limit=1&filter=${filter}&languageId=${this.getLanguageId()}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new CurrencyExchangeService();