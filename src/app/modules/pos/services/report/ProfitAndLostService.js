import BaseService from "../BaseService";

class ProfitAndLostService extends BaseService {

  constructor() {
    super();
    this.module = "report/profit/lose";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new ProfitAndLostService();