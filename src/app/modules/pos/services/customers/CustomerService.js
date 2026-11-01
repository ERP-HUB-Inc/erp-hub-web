import BaseService from "../BaseService";

class POSCustomerService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/pos/customers`;
  }

  create(data) {
    this.setHeader();
    return this.POST({
      url: this.baseUrl,
      data,
      headers: this.header,
    });
  }

  list(search = "") {
    this.setHeader();
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return this.GET({
      url: `${this.baseUrl}${query}`,
      headers: this.header,
    });
  }
}

export default new POSCustomerService();
