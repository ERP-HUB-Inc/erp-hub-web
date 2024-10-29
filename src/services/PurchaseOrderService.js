import BaseService from "./BaseService";

class PurchaseOrderService extends BaseService {

   constructor() {
     super();
     this.baseUrl = `${this.baseUrl}/purchase-orders`;
     this.initializeRoute();
   }
}

export default new PurchaseOrderService();