import BaseService from "../../common/services/BaseService";

class RepaymentService extends BaseService {
  constructor() {
    super();
    this.module = "repayments";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  list(limit, offset, search, locationId, date) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&search=${search}&locationId=${locationId}&date=${date}`,
      headers: this.header
    });
  }

  getHistory(installmentId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/history/${installmentId}`,
      headers: this.header
    });
  }

  create(data) {
    this.setHeader();
    return this.POST({
      url: this.baseUrl,
      data,
      headers: this.header
    });
  }
}

export default new RepaymentService();