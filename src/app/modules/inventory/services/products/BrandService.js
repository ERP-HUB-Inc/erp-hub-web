import BaseService from "../BaseService";

class BrandService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/brand";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new BrandService();