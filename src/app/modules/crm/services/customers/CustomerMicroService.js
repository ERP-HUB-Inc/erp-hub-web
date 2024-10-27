import BaseService from "../../../common/services/BaseService";

class CustomerMicroService extends BaseService {
  host = process.env.REACT_APP_CUSTOMER_API_HOST;
  port = process.env.REACT_APP_CUSTOMER_API_PORT;
  baseUrl = `${this.host}:${this.port}/customers`;

  lists(limit, offset) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset ? offset : 0}`,
      headers: this.header
    });
  }

  detail(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }

  getTotalSpent(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}/total_paid`,
      headers: this.header
    });
  }

  getTotalCredit(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}/total_credit`,
      headers: this.header
    });
  }
}

export default new CustomerMicroService();