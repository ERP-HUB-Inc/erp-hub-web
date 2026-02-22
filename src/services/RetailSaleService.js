import BaseService from "./BaseService";

class RetailSaleService extends BaseService {

   constructor() {
      super();
      this.baseUrl = `${this.baseUrl}/sales/retail`;
   }

   createNewSale(payload) {
      return this.POST({ 
         url: `${this.baseUrl}`,
         data: payload
      });
   }
}

export default new RetailSaleService(); 