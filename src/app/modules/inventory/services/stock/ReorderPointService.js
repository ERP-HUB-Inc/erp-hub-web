import BaseService from "../BaseService";

class ReorderPointService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/product";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new ReorderPointService();