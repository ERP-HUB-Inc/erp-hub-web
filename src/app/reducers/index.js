import { combineReducers } from "redux";
import currencySystem from "../modules/common/reducers/currency";
import businessPlan from "../modules/common/reducers/businessPlan";
import businessType from "../modules/common/reducers/businessType";
import languageSystem from "../modules/common/reducers/language";
import client from "../modules/common/reducers/client";
import user from "../modules/common/reducers/user";
import mail from "../modules/common/reducers/mail";
import paymentMethods from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";
import device from "../modules/pos/reducers/settings/device";
import storeLocation from "../modules/pos/reducers/settings/storeLocation";
import storeLanguage from "../modules/pos/reducers/settings/storeLanguage";
import receiptTemplate from "../modules/pos/reducers/settings/receiptTemplate";
import incomeAndExpense from "../modules/pos/reducers/settings/incomeAndExpense";
import privilege from "../modules/pos/reducers/settings/privilege";
import roleAccess from "../modules/pos/reducers/settings/roleAccess";
import rolePrivilege from "../modules/pos/reducers/settings/rolePrivilege";
import storeAccount from "../modules/pos/reducers/settings/storeAccount";
import operationRecord from "../modules/pos/reducers/settings/operationRecord";
// Employee
import employee from "../modules/hr/reducers/employees/employee";
import customer from "../modules/crm/reducers/customers/customer";
import groupCustomers from "../modules/crm/reducers/customers/group";
import product from "../modules/inventory/reducers/products/product";
import priceTag from "../modules/inventory/reducers/products/priceTag";
import productsUnit from "../modules/inventory/reducers/products/productsUnit";
import brand from "../modules/inventory/reducers/products/brand";
import productsType from "../modules/inventory/reducers/products/productsType";
import productsTag from "../modules/inventory/reducers/products/productsTag";
import variantAttribute from "../modules/inventory/reducers/products/variantAttribute";
// import supplier from "../modules/stock/reducers/supplier";
// transaction
import transaction from "../modules/pos/reducers/transactions/transaction";
import openSaleRegistration from "../modules/pos/reducers/transactions/openSaleRegistration";
import supplier from "../modules/inventory/reducers/stock/supplier";
//stock 
import stockManagement from "../modules/inventory/reducers/stock/stockManagement";
import purchaseOrder from "../modules/inventory/reducers/stock/purchaseOrder";
import stockTransfer from "../modules/inventory/reducers/stock/stockTransfer";
import returnPurchase from "../modules/inventory/reducers/stock/returnPurchase";
import receivePurchase from "../modules/inventory/reducers/stock/receivePurchase";
import reorderPoint from "../modules/inventory/reducers/stock/reorderPoint";
import purchaseOrderSendEmail from "../modules/inventory/reducers/stock/purchaseOrderSendEmail";
//report
import saleReport from "../modules/pos/reducers/report/sale";
import inventoryReport from "../modules/pos/reducers/report/inventory";
import purchaseReport from "../modules/pos/reducers/report/purchase";
import profitAndLostReport from "../modules/pos/reducers/report/profitAndLost";
//home page
import homePage from "../modules/common/reducers/home";

const reducer = combineReducers({
  client,
  currencySystem,
  languageSystem,
  businessPlan,
  businessType,
  // SETTING MODULE
  mail,
  user,
  tax,
  currency,
  device,
  storeLocation,
  storeLanguage,
  paymentMethods,
  receiptTemplate,
  incomeAndExpense,
  roleAccess,
  rolePrivilege,
  privilege,
  storeAccount,
  operationRecord,
  // Employee
  employee,
  customer,
  groupCustomers,
  product,
  priceTag,
  productsUnit,
  brand,
  productsType,
  productsTag,
  variantAttribute,
  //Stock
  supplier,
  stockManagement,
  purchaseOrder,
  stockTransfer,
  returnPurchase,
  receivePurchase,
  reorderPoint,
  purchaseOrderSendEmail,
  //sale report
  saleReport,
  inventoryReport,
  purchaseReport,
  profitAndLostReport,
  transaction,
  openSaleRegistration,

  homePage

});

export default reducer;