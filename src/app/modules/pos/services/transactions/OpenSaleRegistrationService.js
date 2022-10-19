import BaseService from "../BaseService";

class OpenSaleRegistrationService extends BaseService {
  constructor() {
    super();
    this.module = "pos/opensale/registration";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  initializeRoute() {
    super.initializeRoute();
    this.listRoute = `${this.module}/lists/last`;
  }


  last() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists/last`,  
      data: this.data,
      headers: this.header
    });
  }

  summarySoldProducts() {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/lists/summary_sold_products`,
      data: this.data,
      headers: this.header
    });
  }

  open(open, description) {
    this.setHeader();
    const setting = this.Util.getSetting();
    if (setting) {
      this.header["deviceNumber"] = setting["deviceNumber"];
    }
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