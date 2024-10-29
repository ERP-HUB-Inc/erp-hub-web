import BaseService from "./BaseService";

class SupplierService extends BaseService {

   constructor() {
     super();
     this.baseUrl = `${this.baseUrl}/vendors`;
     this.initializeRoute();
   }
}

export default new SupplierService();