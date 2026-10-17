import BaseService from "./BaseService";

class CustomerService extends BaseService {
  constructor() {
    super();
    this.apiBaseUrl = this.baseUrl;
    this.baseUrl = `${this.baseUrl}/customers`;
  }

  resolveLocation(googleMapsUrl) {
    this.setHeader();
    return this.POST({
      url: `${this.apiBaseUrl}/customer/resolve-location`,
      data: { googleMapsUrl },
      headers: this.header
    });
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
