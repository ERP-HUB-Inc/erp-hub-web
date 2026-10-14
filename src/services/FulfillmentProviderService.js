import BaseService from "./BaseService";

class FulfillmentProviderService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/fulfillment-provider`;
  }

  list() {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/v1/lists`,
      headers: this.header
    });
  }
}

export default new FulfillmentProviderService();
