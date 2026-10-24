import BaseService from "../BaseService";

class OpenSaleRegistrationService extends BaseService {
  constructor() {
    super();
    this.module = "pos/shifts";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
    this.initializeRoute();
  }

  initializeRoute() {
    super.initializeRoute();
    this.listRoute = `${this.module}/lists/last`;
  }


  last() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/last-shift`,  
      data: this.data,
      headers: this.header
    });
  }

  summarySoldProducts() {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/summary_sold_products`,
      data: this.data,
      headers: this.header
    });
  }

  open(open, description) {
    this.setHeader();
    return this.POST({
      url: `${this.baseUrl}/open`,
      data: {
        open,
        description
      },
      headers: this.header
    });
  }

  close(id, data) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/close/${id}`,
      data: {
        ...data
      },
      headers: this.header
    });
  }
}

export default new OpenSaleRegistrationService();