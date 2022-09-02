import BaseService from "./BaseService";

class DashboardService extends BaseService {
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
  
  getOverallSales(startDate, endDate) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/overall_sales?startDate=${startDate}&endDate=${endDate}`,  
      data: this.data,
      headers: this.header
    });
  }
}
  
export default new DashboardService();