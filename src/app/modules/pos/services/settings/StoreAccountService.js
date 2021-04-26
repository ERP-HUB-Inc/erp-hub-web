import BaseService from "../BaseService";

class StoreAccountService extends BaseService {

  constructor() {
    super();
    this.module = "client";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new StoreAccountService();