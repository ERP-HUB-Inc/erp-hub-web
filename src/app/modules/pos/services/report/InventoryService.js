import BaseService from "../BaseService";

class InventoryService extends BaseService {
  constructor() {
    super();
    this.module = "report/inventory";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getInventoryDashboard(locationId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/dashboard?locationId=${locationId ? locationId : 0}`,  
      headers: this.header
    });
  }

  getPopularCategories(limit, locationId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/popular_categories?locationId=${locationId ? locationId : 0}&limit=${limit}`,  
      headers: this.header
    });
  }

  getPopularProduct(limit, popularBy, locationId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/popular_products?locationId=${locationId ? locationId : 0}&popularBy=${popularBy}&limit=${limit}`,  
      headers: this.header
    });
  }

  exportPopularProduct(limit, popularBy, locationId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/exports/popular_products?locationId=${locationId ? locationId : 0}&popularBy=${popularBy}&limit=${limit}`,  
      headers: this.header
    });
  }

  getTodayPurchase(locationId) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/today_purchases?locationId=${locationId ? locationId : 0}`,  
      headers: this.header
    });
  }
}

export default new InventoryService();