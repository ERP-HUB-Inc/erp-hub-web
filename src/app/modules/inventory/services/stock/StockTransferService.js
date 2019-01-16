import BaseService from "../BaseService";

class StockTransferService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/stock/transfer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  detail(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/detail/${id}?languageId=${this.getLanguageId()}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new StockTransferService();