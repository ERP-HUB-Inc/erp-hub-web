import BaseService from "./BaseService";

class StockAdjustmentService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/stock-adjustments`;
    this.initializeRoute();
  }

  detail(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/${id}?languageId=${this.getLanguageId()}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new StockAdjustmentService();