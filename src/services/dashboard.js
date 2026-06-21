import BaseService from "./BaseService";

class DashboardService extends BaseService {
  constructor() {
    super();
    this.module = "reports/dashboard";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  getList(period = "") {
    return this.GET({ 
      url: `${this.baseUrl}/today_total?period=${encodeURIComponent(period)}`,  
    });
  }

  getTodayTotal(period = "") {
    return this.GET({ 
      url: `${this.baseUrl}/today_total?period=${encodeURIComponent(period)}`,  
    });
  }

  getRevenueOverview(period = "") {
    return this.GET({
      url: `${this.baseUrl}/revenue_overview${period ? `?period=${encodeURIComponent(period)}` : ""}`,
    });
  }
  
  getOverallSales(startDate, endDate) {
    return this.GET({ 
      url: `${this.baseUrl}/overall_sales?startDate=${startDate}&endDate=${endDate}`
    });
  }

  getWeeklyTrend(period = "") {
    return this.GET({
      url: `${this.baseUrl}/weekly_trend${period ? `?period=${encodeURIComponent(period)}` : ""}`,
    });
  }
}
  
export default new DashboardService();
