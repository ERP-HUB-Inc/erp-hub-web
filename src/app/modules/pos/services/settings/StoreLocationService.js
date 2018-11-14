import BaseService from "../BaseService";

class StoreLocationService extends BaseService {

  constructor() {
    super();
    this.module = "location";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new StoreLocationService();