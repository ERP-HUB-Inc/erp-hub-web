import BaseService from "../BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.module = "payment-method";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  getPaymentMethodsInvoice() {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/invoice_payment_method`,
      headers: this.header
    });
  }
}

export default new PaymentMethodService();