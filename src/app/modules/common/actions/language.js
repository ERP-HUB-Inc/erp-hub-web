
import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";
import sidebar from "../languages/sidebar";
import general from "../languages/general";
import text from "../elements/common/language/text";
import title from "../elements/common/language/title";
import paymentMethod from "../../pos/languages/settings/paymentMethod";
import receiptTemplate from "../../pos/languages/settings/receiptTemplate";
import storeAccount from "../../pos/languages/settings/storeAccount";
import storeLocation from "../../pos/languages/settings/storeLocation";
import roleAccess from "../../pos/languages/settings/roleAccess";
import tax from "../../pos/languages/settings/tax";
import operationRecord from "../../pos/languages/settings/operationRecord";
import language from "../../pos/languages/settings/language";
import currency from "../../pos/languages/settings/currency";
// TRANSACTION
import sale from "../../pos/languages/transactions/sale";

import error from "../elements/common/language/error";
import manageCustomer from "../../crm/languages/customers/customer";
import groupCustomer from "../../crm/languages/customers/group";
import employees from "../../hr/languages/employee";
import product from "../../inventory/languages/products/product"; 
import productUnit from "../../inventory/languages/products/productsUnit";
import brand from "../../inventory/languages/products/brand";
import productType from "../../inventory/languages/products/productsType";
import productTag from "../../inventory/languages/products/productsTag";
import variantAttribute from "../../inventory/languages/products/variantAttribute";
//stock
import supplier from "../../inventory/languages/stock/supplier";
import stockManagement from "../../inventory/languages/stock/stockManagement";
import purchaseOrder from "../../inventory/languages/stock/purchaseOrder";
import stockTransfer from "../../inventory/languages/stock/stockTransfer";
import returnPurchase from "../../inventory/languages/stock/returnPurchase";
import receivePurchase from "../../inventory/languages/stock/receivePurchase";
import reorderPoint from "../../inventory/languages/stock/reorderPoint";
//report 
import saleReport from "../../pos/languages/report/sale";
import inventoryReport from "../../pos/languages/report/inventory";

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
    ...roleAccess,
    ...paymentMethod,
    ...receiptTemplate,
    ...storeAccount,
    ...storeLocation,
    ...tax,
    ...operationRecord,
    ...language,
    ...currency,
    ...sale,
    ...manageCustomer,
    ...groupCustomer,
    ...employees,
    ...product,
    ...productUnit,
    ...brand,
    ...productType,
    ...productTag,
    ...variantAttribute,
    ...supplier,
    ...stockManagement,
    ...purchaseOrder,
    ...stockTransfer,
    ...returnPurchase,
    ...receivePurchase,
    ...reorderPoint,
    ...saleReport,
    ...inventoryReport
  });
}