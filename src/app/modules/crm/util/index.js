import Enum from "../enum";
class Util {

  getCustomerPriceField(customer) {
    let customerFieldPrice = "price";

    if (customer) {
      if (customer.type === Enum.CUSTOMER_TYPE.RETAIL_SALE) {
        customerFieldPrice = "price";
      } else if (customer.type === Enum.CUSTOMER_TYPE.WHOLE_SALE) {
        customerFieldPrice = "wholePrice";
      } else if (customer.type === Enum.CUSTOMER_TYPE.DISTRIBUTOR) {
        customerFieldPrice = "distributePrice";
      }
    }

    return customerFieldPrice;
  }
}

export default new Util();