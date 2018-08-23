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
import managementCustomers from "../modules/crm/reducers/customers/managementCutomers";
// groupcustomer
import groupCustomers from "../modules/crm/reducers/customers/groupCustomers";
import productsUnit from "../modules/inventory/reducers/products/productsUnit";
import brand from "../modules/inventory/reducers/products/brand";
import productsType from "../modules/inventory/reducers/products/productsType";
import productsTag from "../modules/inventory/reducers/products/productsTag";
import supplier from "../modules/stock/reducers/supplier";
//stock
import stockManagement from "../modules/stock/reducers/stockManagement";
import purchaseOrder from "../modules/inventory/reducers/stock/purchaseOrder";

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
  // Employee
  managementEmployee,
  managementCustomers,
  groupCustomers,
  productsUnit,
  brand,
  productsType,
  productsTag,
  supplier,
  stockManagement,
  purchaseOrder
});

export default reducer;