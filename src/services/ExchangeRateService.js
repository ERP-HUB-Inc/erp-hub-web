import BaseService from "./BaseService";

class ExchangeRateService extends BaseService {

   constructor() {
      super();
      this.baseUrl = `${this.baseUrl}/exchange-rates`;
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

export default new ExchangeRateService();