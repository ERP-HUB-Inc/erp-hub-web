import BaseService from "../BaseService";

class ProductService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/brand";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ProductService();