import BaseService from "../BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.module = "payment-method";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder
  ) {
    return this.fetchData({ 
	      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}`,
	      method: "GET",
	      data: {},
	      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzMTcyMTIzMX0.JPOJSNqCPXWeAFkBfkdSULvTPI6TIXW6LYmJRWUDyL4"
	      }
	    });
  }

  archive(ids) {
    return this.fetchData({ 
      url: `${this.baseUrl}/archive/${ids}`,
      method: "DELETE",
      data: {},
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzMTcyMTIzMX0.JPOJSNqCPXWeAFkBfkdSULvTPI6TIXW6LYmJRWUDyL4"
      }
    });
  }
}

export default new PaymentMethodService();