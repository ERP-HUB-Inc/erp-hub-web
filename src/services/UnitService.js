import BaseService from "./BaseService";

class UnitService extends BaseService {
   constructor() {
     super();
     this.baseUrl = `${this.baseUrl}/${this.module}/units`;
   }
 }
 
 export default new UnitService();