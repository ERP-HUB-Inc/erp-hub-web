import BaseService from "./BaseService";

class ExchangeRateService extends BaseService {

   normalizeRateData(data = {}) {
      const normalized = { ...data };
      if (normalized.sellRate !== undefined) normalized.sellRate = Number(normalized.sellRate);
      if (normalized.buyRate !== undefined) normalized.buyRate = Number(normalized.buyRate);
      return normalized;
   }

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

   getExchangeRates() {
      this.setHeader();
      return this.GET({
         url: this.baseUrl,
         headers: this.header
      });
   }

   getExchangeRateById(id) {
      this.setHeader();
      return this.GET({
         url: `${this.baseUrl}/${encodeURIComponent(id)}`,
         headers: this.header
      });
   }

   createExchangeRate(data) {
      this.setHeader();
      return this.POST({
         url: this.baseUrl,
         data: this.normalizeRateData(data),
         headers: this.header
      });
   }

   updateExchangeRate(id, data) {
      this.setHeader();
      return this.PUT({
         url: `${this.baseUrl}/${encodeURIComponent(id)}`,
         data: this.normalizeRateData(data),
         headers: this.header
      });
   }

   deleteExchangeRate(id) {
      this.setHeader();
      return this.DELETE({
         url: `${this.baseUrl}/${encodeURIComponent(id)}`,
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
