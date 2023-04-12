import BaseService from "../BaseService";

class CustomerService extends BaseService {

  constructor() {
    super();
    this.module = "customer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getCredit(customerId) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/get_credit/${customerId}`,
      headers: this.header
    });
  }
}

export default new CustomerService();