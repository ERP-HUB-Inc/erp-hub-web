import BaseService from "../BaseService";

class ProductsUnitService extends BaseService {

  constructor() {
    super();
    this.module = "unit";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ProductsUnitService();