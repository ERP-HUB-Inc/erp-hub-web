import BaseService from "./BaseService";

class ClientService extends BaseService {
  constructor() {
    super();
    this.module = "client";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findClientByColumn(option = {column: "", value: ""}) {
    this.module = "client";
    this.baseUrl = `${this.generateAPIUrl()}/${this.module}/${this.version}`;
    return this.GET(
      {
        url: `${this.baseUrl}/find/${option.column}/${option.value}`,
        data: {},
        headers: this.header
      }
    );
  }

  getInitializeSetting() {
    this.module = "client";
    this.baseUrl = `${this.generateAPIUrl()}/${this.module}/${this.version}`;
    this.setHeader();
    return this.GET(
      {
        url: `${this.baseUrl}/initial/setting`,
        data: {},
        headers: this.header
      }
    );
  }

  register(data) {
    return this.POST({
      url: `${this.baseUrl}/register`,
      headers: this.header,
      data
    });
  }

  signin(userName, password, storeName) {
    this.module = "auth";
    this.baseUrl = `${this.generateAPIUrl()}/${this.module}/${this.version}`;
    return this.POST({
      url: `${this.baseUrl}/login`,
      headers: {
        "Content-Type": "application/json",
        "storeName": storeName,
        "userName": userName,
        "password": password,
        "deviceNumber": localStorage.getItem(this.ConstantAuth.ACCESS_DEVICE)
      },
      data: {}
    });
  }

  domainSignin(storeName) {
    return this.POST({
      url: `${this.baseUrl}/signin`,
      headers: {
        "Content-Type": "application/json",
        "storeName": storeName
      },
      data: {}
    });
  }
}
  
export default new ClientService();