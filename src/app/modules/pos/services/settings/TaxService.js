import BaseService from "../BaseService";

class TaxService extends BaseService {

  constructor() {
    super();
    this.module = "tax";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists() {
    return this.fetchData({ 
	      url: `${this.baseUrl}/lists`,
	      method: "GET",
	      data: {},
	      headers: {
	        "Content-Type": "application/json"
	      }
	    });
  }
}

export default new TaxService();