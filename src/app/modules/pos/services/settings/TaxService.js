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
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzMTcyMTIzMX0.JPOJSNqCPXWeAFkBfkdSULvTPI6TIXW6LYmJRWUDyL4"
	      }
	    });
  }
}

export default new TaxService();