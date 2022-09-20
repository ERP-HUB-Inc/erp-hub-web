import BaseService from "../../../common/services/BaseService";

class RewardHistoryService extends BaseService {
  host = process.env.REACT_APP_CUSTOMER_API_HOST;
  port = process.env.REACT_APP_CUSTOMER_API_PORT;
  baseUrl = `${this.host}:${this.port}/rewards_history`;

  lists(customerId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?customerId=${customerId}`,
      headers: this.header
    });
  }

  create(data) {
    this.setHeader();
    return this.POST({
      url: `${this.baseUrl}`,
      headers: this.header,
      data
    });
  }
}

export default new RewardHistoryService();