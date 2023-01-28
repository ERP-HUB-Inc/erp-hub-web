import BaseService from "../BaseService";

class CurrencyExchangeService extends BaseService {

   constructor() {
      super();
      this.module = "currency/exchange";
      this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
      this.initializeRoute();
   }

   getExchangeRate(filter) {
      this.setHeader();
      return this.GET({
         url: `${this.baseUrl}/lists?limit=1&filter=${filter}&languageId=${this.getLanguageId()}`,
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