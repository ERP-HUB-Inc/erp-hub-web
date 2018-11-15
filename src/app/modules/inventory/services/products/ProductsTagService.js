import BaseService from "../BaseService";

class ProductsTagService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/tag";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new ProductsTagService();