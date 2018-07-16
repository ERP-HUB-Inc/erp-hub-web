import BaseService from "../BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.module = "payment-method";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists() {
    return this.fetchData({ 
	      url: `${this.baseUrl}/lists`,
	      method: "GET",
	      data: {},
	      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzMTcwNDY1NH0.TFtq-9WqPcfaUIjj51RtejRWwPmmPtBcedT1-ioEBsU"
	      }
	    });
  }
}

export default new PaymentMethodService();