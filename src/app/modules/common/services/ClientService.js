import BaseService from "./BaseService";

class ClientService extends BaseService {
  constructor() {
    super();
    this.module = "client";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findClientByColumn(option = {column: "", value: ""}) {
    return this.fetchData(
      {
        url: `${this.baseUrl}/find/${option.column}/${option.value}`,
        data: {},
        headers: this.header
      }
    );
  }

  register(data) {
    return this.addData({
      url: `${this.baseUrl}/register`,
      headers: this.header,
      data
    });
  }

  signin(userName, password) {
    this.module = "auth";
    this.baseUrl = `${this.generateAPIUrl()}/${this.module}/${this.version}`;
    return this.addData({
      url: `${this.baseUrl}/login`,
      headers: {
        "Content-Type": "application/json",
        "storeKey": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjYXNvbHV0aW9uIiwiaWF0IjoxNTMyOTI0ODkzfQ.mJljdZhZB3LjBKFA2q0Tte3EXMlYLqcEj3VcYfkXDqA",
        "userName": userName,
        "password": password
      },
      data: {}
    });
  }

  domainSignin(storeName) {
    return this.addData({
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