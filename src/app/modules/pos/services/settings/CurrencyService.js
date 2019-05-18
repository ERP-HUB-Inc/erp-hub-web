import BaseService from "../BaseService";

class CurrencyService extends BaseService {

  constructor() {
    super();
    this.module = "currency";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  listsAllSubCurrency() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/find/sub/currency`,  
      data: this.data,
      headers: this.header
    });
  }
}

export default new CurrencyService();