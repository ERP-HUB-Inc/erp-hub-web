import BaseService from "./BaseService";

class BusinessPlanService extends BaseService {
  constructor() {
    super();
    this.module = "business-plan";
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
  
export default new BusinessPlanService();