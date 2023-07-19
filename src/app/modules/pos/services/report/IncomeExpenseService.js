import BaseService from "../BaseService";

class IncomeExpenseService extends BaseService {
  constructor() {
    super();
    this.module = "report/expense";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getExpenses(startDate, endDate) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists?startDate=${startDate}&endDate=${endDate}`,  
      headers: this.header
    });
  }
}

export default new IncomeExpenseService();