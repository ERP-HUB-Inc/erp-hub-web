import BaseService from "../BaseService";

class CurrencyExchangeService extends BaseService {

   constructor() {
      super();
      this.module = "exchange-rates";
      this.baseUrl = `${this.baseUrl}/${this.module}`;
      this.initializeRoute();
   }

   getExchangeRate(filter) {
      this.setHeader();
      return this.GET({
         url: `${this.baseUrl}?limit=1&filter=${filter}`,
         data: this.data,
         headers: this.header
      });
   }

   getCurrentExchangeRate() {
      this.setHeader();
      return this.GET({
         url: `${this.baseUrl}/current`,
         headers: this.header
      });
   }
}

export default new CurrencyExchangeService();