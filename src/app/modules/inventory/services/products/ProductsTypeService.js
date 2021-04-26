import BaseService from "../BaseService";

class ProductsTypeService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/product/type";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ProductsTypeService();