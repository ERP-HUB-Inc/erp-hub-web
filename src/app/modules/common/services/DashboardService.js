import BaseService from "./BaseService";

class HomeService extends BaseService {
  constructor() {
    super();
    this.module = "report/summary/dashboard";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists(range = "") {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists?rangeFilter=${range}`,  
      data: this.data,
      headers: this.header
    });
  }
  

}
  
export default new HomeService();