import BaseService from "../BaseService";

class ProfitAndLostService extends BaseService {

  constructor() {
    super();
    this.module = "report/profit/lose";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  summaries(startDate, endDate){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/summaries?startDate=${startDate}&endDate=${endDate}`,
      headers: this.header
    });
  }

  exportSummaries(startDate, endDate){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/exports?startDate=${startDate}&endDate=${endDate}`,
      headers: this.header
    });
  }
}

export default new ProfitAndLostService();