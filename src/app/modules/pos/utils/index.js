class Util {
  getSummaryTotalInOrder(orderList, priceFeild = "price") {
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
      const totalAmount = this.getTotalAmount(value.quantity, value[priceFeild]);
      summaryTotal.totalQuantity += value.quantity;
      summaryTotal.subTotal += totalAmount;
      summaryTotal.subTotalAfterDiscount += this.getTotalAmountAfterDiscount(value.quantity, value[priceFeild], value.discount);
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
  
  getDiscountRateByAmount(oldPrice, discountAmount) {
    return (discountAmount * 100) / oldPrice;
  }

  getGrandTotal(value = 0, tax = 0, discount = 0) {
    const grandTotal = (value + tax) - discount;
    return grandTotal < 0 ? 0 : grandTotal;
  }

  getGrandTotalWithOutDiscount(value = 0, tax = 0) {
    const grandTotal = value + tax;
    return grandTotal < 0 ? 0 : grandTotal;
  }

  appendCustomerPaymentList(customerPaymentList, giveAmount, paymentMethod, balance) {
    const change = giveAmount - balance;
    if (customerPaymentList.length === 0) {
      customerPaymentList.push({
        tender: giveAmount,
        balance,
        change: change < 0 ? 0 : change,
        paymentMethodName: paymentMethod.name,
        paymentMethodId: paymentMethod.id
      });
    } else {
      let isNotTheSame = true;
      customerPaymentList.forEach((payment, index) => {
        if (payment.paymentMethodId === paymentMethod.id) {
          isNotTheSame = false;
          customerPaymentList[index]["tender"] += giveAmount;
          customerPaymentList[index]["change"] += change;
        }
      });

      if (isNotTheSame) {
        customerPaymentList.push({
          tender: giveAmount,
          balance,
          change: change < 0 ? 0 : change,
          paymentMethodName: paymentMethod.name,
          paymentMethodId: paymentMethod.id
        });
      }
    }

    return customerPaymentList;
  }

  appendProductTaxList(productOrderList) {
    const productTaxList = [];

    if (productOrderList.length === 0) {
      return productTaxList;
    }

    productOrderList.forEach(productOrder => {
      const productTax = productOrder.taxDescription;
      const totalTaxAmount = this.getTaxAmount(productOrder.newPrice * productOrder.quantity, productTax.taxRate);
      if (productTaxList.length === 0 && productTax.taxRate > 0) {
        productTaxList.push({
          name: productTax.taxName,
          rate: productTax.taxRate,
          totalTaxAmount
        });
      } else {
        let isNotTheSame = true;
        productTaxList.forEach((taxOfProduct, productTaxIndex) => {
          if (taxOfProduct.rate === productTax.taxRate) {
            isNotTheSame = false;
            productTaxList[productTaxIndex]["totalTaxAmount"] += totalTaxAmount;
          }
        });
        if (isNotTheSame && productTax.taxRate > 0) {
          productTaxList.push({
            name: productTax.taxName,
            rate: productTax.taxRate,
            totalTaxAmount
          });
        } else {
          
        }
      }
    });
    return productTaxList;
  }

  toSubCurrencyGrantTotal(grandTotalOfBaseCurrency, baseCurrency, subCurrency) {
    if (baseCurrency && subCurrency) {
      return grandTotalOfBaseCurrency * (subCurrency.value / baseCurrency.value);
    } else {
      return 0;
    }
  }

  getTaxDescription(tax) {
    let name = "";
    if ("tax" in tax && tax["tax"]) {
      name = tax["tax"].name;
    }
    return name;
  }

  getTaxFromProduct(product) {
    let taxId = 0;
    let taxRate = 0;
    let taxName = "";
    if (product["productTaxes"] && product["productTaxes"].length > 0) {
      taxId = product["productTaxes"][0].id;
      taxRate = product["productTaxes"][0].rate;
      taxName = this.getTaxDescription(product["productTaxes"][0]);
    }
    return {
      id: taxId,
      taxRate,
      taxName
    };
  }

  getSummaryTax(productTaxList, title, sufixTitle) {
    let taxTotal = 0;
    let taxTitle = title;
    let countTax = 0;
    productTaxList.forEach(productTax => {
      taxTotal += productTax.totalTaxAmount;
      countTax++;
    });

    if (countTax > 1) {
      taxTitle = `${countTax} ${sufixTitle}`;
    } else if (countTax === 1) {
      taxTitle = `${productTaxList[0].name}`;
    }

    return {
      taxTitle,
      taxTotal,
      countTax
    };
  }
}

export default new Util();