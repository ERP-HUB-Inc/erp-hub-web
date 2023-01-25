import BaseService from "../BaseService";

class StockCountService extends BaseService {
  constructor() {
    super();
    this.module = "stock_counts";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  detail(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }

  lists(limit, offset, sortField, sortOrder, filter, search, rangeFilter) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${search}&rangFilter=${rangeFilter}`,
      headers: this.header
    });
  }

  getStockCountEntriesByStatus(id, status) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/status/${id}?status=${status}`,
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

  markAsCompleted(id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/mark_as_completed/${id}`,
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

export default new StockCountService();