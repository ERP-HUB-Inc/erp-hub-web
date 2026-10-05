import BaseService from "../BaseService";

const FINANCIAL_REPORT_TIMEOUT = 300000;

class FinancialService extends BaseService {

  getDashboard(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/financial/dashboard?${this.bindQueryParam(option)}`,
      headers: this.header,
      timeout: FINANCIAL_REPORT_TIMEOUT
    });
  }

  getSummary(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/financial/summaries?${this.bindQueryParam(option)}`,
      headers: this.header,
      timeout: FINANCIAL_REPORT_TIMEOUT
    });
  }
}

export default new FinancialService();
