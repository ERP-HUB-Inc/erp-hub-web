import React from "react";
import { Translate } from "react-localize-redux";
import { stringTranslate } from "../../../../../common/helper/stringTranslate";
import Util from "../../../../../common/util";
import POSUtil from "../../../../utils";
import InventoryEnum from "../../../../../inventory/enums";
import ReceiptTemplate1 from "./template1";
import ReceiptTemplate2 from "./template2";

const receiptTemplate = {
  temp1: 1,
  temp2: 2
};

const ReceiptTemplate = React.forwardRef((props, ref) => {
  const util = new Util();
  function getCurrentUserForRePrintReceipt(data) {
    let currentUser = {
      setting: {
        storeName: "",
        address: "",
        phoneNumber: "",
        businessName: ""
      },
      currentUser: {
        fullName: ""
      }
    };

    if (data.client) {
      currentUser.setting.storeName = data.client.storeName;
      currentUser.setting.address = data.client.address;
      currentUser.setting.phoneNumber = data.client.phoneNumber;
      currentUser.setting.businessName = data.client.businessName;
    }

    if (data.user) {
      currentUser.currentUser.fullName = data.user.fullName;
    }

    return currentUser;
  }

  function getSummaryTotal(data) {
    return {
      subTotalAfterDiscount: data.totalExcludeTax - data.discount
    };
  }

  function getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }

  function getCustomerPaymentList(data) {
    let customerPaymentList = [];
    let changeAmount = 0;
    if (util.isValidCollectionInObj(data, "transactionPayment")) {
      data.transactionPayment.forEach(payment => {
        if (payment.paymentMethod == null) {
          payment.paymentMethod = {};
        }

        if (payment.change > 0) {
          changeAmount = payment.change;
        }

        customerPaymentList = POSUtil.appendCustomerPaymentList(customerPaymentList, payment.tender, payment.paymentMethod, payment.balance);
      });
    }
    return {
      customerPaymentList,
      changeAmount
    };
  }

  function getProductOrderList(data) {
    let productOrderList = [];
    if (util.isValidCollectionInObj(data, "transactionEntries")) {
      data.transactionEntries.forEach(transactionEntry => {
        if (transactionEntry.productVariant && transactionEntry.productVariant.product) {
          const productVariant = transactionEntry.productVariant;
          const tax = POSUtil.getTaxFromProduct(productVariant.product);
          productOrderList.push({
            quantity: transactionEntry.quantity,
            name: productVariant.product.name,
            namekm: productVariant.product.namekm,
            variantName: productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ? productVariant.name : "",
            tax: tax.taxRate/100,
            taxDescription: tax,
            price: transactionEntry.price,
            discount: transactionEntry.discount,
            newPrice: transactionEntry.price
          });
        }
      });
    }
    return productOrderList;
  }

  function getProductTaxList(productOrderList) {
    return POSUtil.appendProductTaxList(productOrderList);
  }

  const {formData} = props;
  formData.receiptTemplate = 2;
  let receipt = <ReceiptTemplate1 formData={formData} />;
  if (formData.receiptTemplate === receiptTemplate.temp2) {
    const customerPayment = getCustomerPaymentList(formData);
    const productOrderList = getProductOrderList(formData);
    const productTaxList = getProductTaxList(productOrderList);
    receipt = <ReceiptTemplate2 
      data={formData} 
      customer={formData.customer}
      isRequestClearMarginLeft={true}
      isRequestShowDetail={true}
      receiptTemplate={props.receiptTemplate}
      currentUser={getCurrentUserForRePrintReceipt(formData)}
      customerPaymentList={customerPayment.customerPaymentList}
      productList={productOrderList}
      productTaxList={productTaxList}
      customerFieldPrice="price"
      summaryTotal={getSummaryTotal(formData)}
      summaryTax={POSUtil.getSummaryTax(productTaxList, <Translate id="text_no_tax"/>, stringTranslate("text_taxes", props.locale))}
      changeAmount={customerPayment.changeAmount}
      taxAmount={getTaxAmount(formData)}
      discountAmount={formData.discount}
    />;
  }

  return (
    <div ref={ref}>
      {receipt}
    </div>
  );
});

export default ReceiptTemplate;

ReceiptTemplate.defaultProps = {
  formData: {
    invoiceNumber: "",
    receiptNumber: "",
    receiptTemplate: receiptTemplate.temp1,
    createdAt: "2022-07-08",
    total: 0,
    customer: {
      company: ""
    }
  }
};