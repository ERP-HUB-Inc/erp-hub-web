import BaseService from "./BaseService";

class BrandService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/brands`;
  }
}

export default new BrandService();