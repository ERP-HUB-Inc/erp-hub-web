import BaseService from "./BaseService";

class PaymentMethodService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/payment-methods`;
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