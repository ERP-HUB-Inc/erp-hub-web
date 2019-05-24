import BaseService from "../BaseService";

class DeviceService extends BaseService {

  constructor() {
    super();
    this.module = "device";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  update(deviceName, number, storeName) {
    this.header["storeName"] = storeName;
    this.header["deviceName"] = deviceName;
    return this.PUT({
      url: `${this.baseUrl}/update/${number}`,
      data: {},
      headers: this.header
    });
  }

  renew(id) {
    return this.PUT({
      url: `${this.baseUrl}/renew/${id}`,
      data: {},
      headers: this.header
    });
  }
}

export default new DeviceService();