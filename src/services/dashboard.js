import BaseService from "./BaseService";

class DashboardService extends BaseService {
  constructor() {
    super();
    this.module = "reports/dashboard";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  getList(range = "") {
    return this.GET({ 
      url: `${this.baseUrl}/today_total?rangeFilter=${range}`,  
    });
  }

  getTodayTotal(range = "") {
    return this.GET({ 
      url: `${this.baseUrl}/today_total?rangeFilter=${range}`,  
    });
  }
  
  getOverallSales(startDate, endDate) {
    return this.GET({ 
      url: `${this.baseUrl}/overall_sales?startDate=${startDate}&endDate=${endDate}`
    });
  }
}
  
export default new DashboardService();