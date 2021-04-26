import Schema from "../schema";

class PaymentMethod extends Schema {
  constructor() {
    super();
    this.entityName = "paymentMethods";
  }
}

export default new PaymentMethod();