import BaseService from "./BaseService";

class CategoryService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/categories`;
  }
}

export default new CategoryService();