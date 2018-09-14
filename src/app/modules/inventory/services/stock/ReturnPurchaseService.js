import BaseService from "../BaseService";

class SupplierService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/purchase/return";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new SupplierService();