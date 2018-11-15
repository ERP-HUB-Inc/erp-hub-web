import BaseService from "../BaseService";

class CustomerService extends BaseService {

  constructor() {
    super();
    this.module = "customer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new CustomerService();