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
        header: this.header
      }
    );
  }

  register(data) {
    return this.addData({
      url: `${this.baseUrl}/register`,
      header: this.header,
      data
    });
  }
}
  
export default new ClientService();