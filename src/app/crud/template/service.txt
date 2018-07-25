import BaseService from "../BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.module = "payment-method";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }
}

export default new PaymentMethodService();