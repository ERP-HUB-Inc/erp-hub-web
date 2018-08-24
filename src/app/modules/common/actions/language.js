
import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";
import sidebar from "../languages/sidebar";
import general from "../languages/general";
import text from "../elements/common/language/text";
import title from "../elements/common/language/title";
import modal from "../../pos/languages/shares/modal";
import paymentMethod from "../../pos/languages/settings/paymentMethod";
import receiptTemplate from "../../pos/languages/settings/receiptTemplate";
import storeAccount from "../../pos/languages/settings/storeAccount";
import storeLocation from "../../pos/languages/settings/storeLocation";
import roleAccess from "../../pos/languages/settings/roleAccess";
import tax from "../../pos/languages/settings/tax";
import operationRecord from "../../pos/languages/settings/operationRecord";
import language from "../../pos/languages/settings/language";
import currency from "../../pos/languages/settings/currency";
import error from "../elements/common/language/error";
import manageCustomer from "../../crm/languages/customers/manageCustomers";
import groupCustomer from "../../crm/languages/customers/groupCustomers";
import employees from "../../hr/languages/employee";    
import productUnit from "../../inventory/languages/products/productsUnit";
import brand from "../../inventory/languages/products/brand";
import productType from "../../inventory/languages/products/productsType";
import productTag from "../../inventory/languages/products/productsTag";
//stock
import supplier from "../../inventory/languages/stock/supplier";
import stockManagement from "../../inventory/languages/stock/stockManagement";
import purchaseOrder from "../../inventory/languages/stock/purchaseOrder";
import stockTransfer from "../../inventory/languages/stock/stockTransfer";

export function initLanguage() {
  return initialize([
    { name: "English", code: "en" },
    { name: "မြန်မာ", code: "bm" },
    { name: "ភាសារខ្មែរ", code: "km" }
  ]);
}

export function setTranslation() {
  return addTranslation({
    ...headers,
    ...footers,
    ...text,
    ...title,
    ...error,
    ...general,
    ...sidebar,
    ...modal,
    ...roleAccess,
    ...paymentMethod,
    ...receiptTemplate,
    ...storeAccount,
    ...storeLocation,
    ...tax,
    ...operationRecord,
    ...language,
    ...currency,
    ...manageCustomer,
    ...groupCustomer,
    ...employees,
    ...productUnit,
    ...brand,
    ...productType,
    ...productTag,
    ...supplier,
    ...stockManagement,
    ...purchaseOrder,
    ...stockTransfer
  });
}