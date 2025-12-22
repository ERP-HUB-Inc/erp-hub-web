import BaseService from "./BaseService";

class VendorService extends BaseService {

   constructor() {
     super();
     this.baseUrl = `${this.baseUrl}/vendors`;
     this.initializeRoute();
   }
}

export default new VendorService();