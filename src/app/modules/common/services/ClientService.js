import BaseService from "./BaseService";

class ClientService extends BaseService {
  constructor() {
    super();
    this.module = "client";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findClientByColumn(option = {column: "", value: ""}) {
    return this.GET(
      {
        url: `${this.baseUrl}/find/${option.column}/${option.value}`,
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

  signin(userName, password) {
    this.module = "auth";
    this.baseUrl = `${this.generateAPIUrl()}/${this.module}/${this.version}`;
    return this.POST({
      url: `${this.baseUrl}/login`,
      headers: {
        "Content-Type": "application/json",
        "storeKey": `Bearer ${this.Util.getAccessToken(this.ConstantAuth.STORE_ACCESS_TOKEN)}`,
        "userName": userName,
        "password": password
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