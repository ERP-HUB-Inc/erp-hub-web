import BaseService from "../BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.module = "payment-method";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder
  ) {
    return this.fetchData({ 
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}`,
      method: "GET",
      data: this.data,
      headers: this.header
    });
  }

  archive(ids) {
    return this.fetchData({ 
      url: `${this.baseUrl}/archive/${ids}`,
      method: "DELETE",
      data: this.data,
      headers: this.header
    });
  }

  add(data) {
    return this.fetchData({
      url: `${this.baseUrl}/create`,
      method: "POST",
      data: {
        ...data,
        isSystem: 0,
        isDefault: 0
      },
      headers: this.header
    });
  }
}

export default new PaymentMethodService();