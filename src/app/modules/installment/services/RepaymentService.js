import BaseService from "../../common/services/BaseService";

class RepaymentService extends BaseService {
  constructor() {
    super();
    this.module = "repayments";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  list(limit, offset, search, locationId, dateRange) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&search=${search}&locationId=${locationId}&rangFilter=${dateRange}`,
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

  detailSchedule(scheduleId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/schedule/${scheduleId}`,
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

  getSummary(search, rangeFilter) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/v1/summary?search=${search}&rangFilter=${rangeFilter}`,
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

  update(data, id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/${id}`,
      data,
      headers: this.header
    });
  }

  delete(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }
}

export default new RepaymentService();