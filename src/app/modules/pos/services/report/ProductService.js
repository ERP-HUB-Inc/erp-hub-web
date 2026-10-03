import BaseService from "../BaseService";

class ProductService extends BaseService {
  constructor() {
    super();
    this.module = "report/product";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getProductReport(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists?${this.bindQueryParam(option)}`,  
      headers: this.header
    });
  }

  getInventoryStockReport(option) {
    this.setHeader();
    return this.GET({
      url: `${this.generateAPIUrl()}/report/products?${this.bindQueryParam(option)}`,
      headers: this.header
    });
  }

  exportProducts(option) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/exports?${this.bindQueryParam(option)}`,  
      headers: this.header
    });
  }
  
}

export default new ProductService();
