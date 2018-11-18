import BaseService from "../BaseService";

class ProductService extends BaseService {
  constructor() {
    super();
    this.module = "report/inventory/product";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new ProductService();