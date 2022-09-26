import BaseService from "../BaseService";

class StockConsignmentService extends BaseService {
  host = process.env.REACT_APP_INVENTORY_API_HOST;
  port = process.env.REACT_APP_INVENTORY_API_PORT;
  baseUrl = `${this.host}:${this.port}/stock_consignments`;

  lists(limit, offset = 0, status = "") {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&status=${status}`,
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

  create(data) {
    this.setHeader();
    return this.POST({
      url: `${this.baseUrl}`,
      data,
      headers: this.header
    });
  }

  update(id, data) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/${id}`,
      data,
      headers: this.header
    });
  }

  archive(ids) {
    this.setHeader();
    return this.DELETE({  
      url: `${this.baseUrl}/${ids}`,
      headers: this.header
    });
  }
}

export default new StockConsignmentService();