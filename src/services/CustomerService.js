import BaseService from "./BaseService";

class CustomerService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/customers`;
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