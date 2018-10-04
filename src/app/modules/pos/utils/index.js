class Util {
  getSummaryTotalInOrder(orderList) {
    let summaryTotal = {
      subTotal: 0,
      totalQuantity: 0,
      subTotalAfterDiscount: 0,
      discount: 0,
      tax: 0
    };

    if (orderList === null || !Array.isArray(orderList)) 
      return summaryTotal;

    orderList.forEach(value => {
      const totalAmount = this.getTotalAmount(value.quantity, value.price);
      summaryTotal.totalQuantity += value.quantity;
      summaryTotal.subTotal += totalAmount;
      summaryTotal.subTotalAfterDiscount += this.getTotalAmountAfterDiscount(value.quantity, value.price, value.discount);
      summaryTotal.discount += this.getDiscountByRate(totalAmount, value.discount);
    });

    return summaryTotal;
  }

  getTaxAmount(value, rate) {
    if (value === null || isNaN(value))
      return 0;
    
    if (rate === null || isNaN(rate))
      return 0;

    return (value * rate) / 100;
  }

  getDiscountByRate(amount, rate) {
    let discount = 0;

    if (isNaN(rate)) 
      return discount;

    discount = (amount * rate) / 100;

    return discount < 0 ? 0 : discount;
  }

  getTotalAmount(quantity, price) {
    const totalAmount =  (quantity * price);
    return totalAmount < 0 ? 0 : totalAmount;
  }

  getTotalAmountAfterDiscount(quantity, price, rate) {
    const totalAmount = this.getTotalAmount(quantity, price);
    const result = totalAmount - this.getDiscountByRate(totalAmount, rate);
    return result < 0 ? 0 : result; 
  }

  getGrandTotal(value = 0, tax = 0, discount = 0) {
    const grandTotal = (value + tax) - discount;
    return grandTotal < 0 ? 0 : grandTotal;
  }


}

export default new Util();