import { combineReducers } from "redux";
import currencySystem from "../modules/common/reducers/currency";
import businessPlan from "../modules/common/reducers/businessPlan";
import businessType from "../modules/common/reducers/businessType";
import languageSystem from "../modules/common/reducers/language";
import client from "../modules/common/reducers/client";
import user from "../modules/common/reducers/user";
import PaymentMethods from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";
import storeLocation from "../modules/pos/reducers/settings/storeLocation";
import storeLanguage from "../modules/pos/reducers/settings/storeLanguage";
import receiptTemplate from "../modules/pos/reducers/settings/receiptTemplate";
import incomeAndExpense from "../modules/pos/reducers/settings/incomeAndExpense";
import roleAccess from "../modules/pos/reducers/settings/roleAccess";
import privilege from "../modules/pos/reducers/settings/privilege";
import rolePrivilege from "../modules/pos/reducers/settings/rolePrivilege";
import storeAccount from "../modules/pos/reducers/settings/storeAccount";
import operationRecord from "../modules/pos/reducers/settings/operationRecord";
// Employee
import managementEmployee from "../modules/hr/reducers/employees/managementEmployee";
//customer 
import managementCustomers from "../modules/crm/reducers/customers/customer";
// groupcustomer
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
//sale
import saleHistory from "../modules/pos/reducers/transactions/saleHistory";

const reducer = combineReducers({
  client,
  currencySystem,
  languageSystem,
  businessPlan,
  businessType,
  // SETTING MODULE
  user,
  tax,
  currency,
  storeLocation,
  storeLanguage,
  PaymentMethods,
  receiptTemplate,
  incomeAndExpense,
  roleAccess,
  rolePrivilege,
  privilege,
  storeAccount,
  operationRecord,
  //Transaction
  transaction,
  // Employee
  managementEmployee,
  managementCustomers,
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

  saleHistory
  
});

export default reducer;