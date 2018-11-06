import BaseService from "../BaseService";

class DeviceService extends BaseService {

  constructor() {
    super();
    this.module = "device";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  update(number, storeName) {
    this.header["storeName"] = storeName;
    return this.PUT({
      url: `${this.baseUrl}/update/${number}`,
      data: {},
      headers: this.header
    });
  }
}

export default new DeviceService();