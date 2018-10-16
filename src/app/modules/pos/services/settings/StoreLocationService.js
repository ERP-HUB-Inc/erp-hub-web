import BaseService from "../BaseService";

class StoreLocationService extends BaseService {

  constructor() {
    super();
    this.module = "location";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findLocationByStoreName(storeName) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET(
      {
        url: `${this.baseUrl}/lists/storename/${storeName}`,
        data: {},
        headers: this.header
      }
    );
  }
}

export default new StoreLocationService();