import BaseService from "./BaseService";

class HomeService extends BaseService {
  constructor() {
    super();
    this.module = "report/income/expense/pipe";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists() {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists`,  
      data: this.data,
      headers: this.header
    });
  }
  

}
  
export default new HomeService();