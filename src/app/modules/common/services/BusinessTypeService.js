import BaseService from "./BaseService";

class BusinessTypeService extends BaseService {
  constructor() {
    super();
    this.module = "business-type";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findSystemRecord(option = {column: "", value: ""}) {
    return this.fetchData(
      {
        url: `${this.baseUrl}/find/all`,
        data: {},
        header: this.header
      }
    );
  }
}
  
export default new BusinessTypeService();