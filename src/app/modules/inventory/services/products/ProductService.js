import BaseService from "../BaseService";

class ProductService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/products";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ProductService();