import BaseService from "./BaseService";

class GraphService extends BaseService {
  constructor() {
    super();
    this.module = "income/expense/graph";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists`,  
      data: this.data,
      headers: this.header
    });
  }
  

}
  
export default new GraphService();