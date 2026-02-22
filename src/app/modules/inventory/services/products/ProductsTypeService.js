import BaseService from "../BaseService";

class ProductsTypeService extends BaseService {

  constructor() {
    super();
    this.module = "categories";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }
}

export default new ProductsTypeService();