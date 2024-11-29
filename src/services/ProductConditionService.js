import BaseService from "./BaseService";

class ProductConditionService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/conditions`;
    this.initializeRoute();
  }
}

export default new ProductConditionService();