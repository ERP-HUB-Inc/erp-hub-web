
import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
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
import priceTag from "../../inventory/languages/products/priceTag"; 
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
import stockAdjustmentRequest from "../../inventory/languages/stock/stockAdjustmentRequest";
import stockAdjustmentApprove from "../../inventory/languages/stock/stockAdjustmentApprove";
import returnPurchase from "../../inventory/languages/stock/returnPurchase";
import receivePurchase from "../../inventory/languages/stock/receivePurchase";
import reorderPoint from "../../inventory/languages/stock/reorderPoint";
//report 
import saleReport from "../../pos/languages/report/sale";
import inventoryReport from "../../pos/languages/report/inventory";
import profitAndLostReport from "../../pos/languages/report/profitAndLost";
//transaction
import saleHistory from "../../pos/languages/transactions/saleHistory";
// home page
import homePage from "../../common/languages/home";

export function initLanguage() {
  return initialize([
    {name: "English", code: "en"},
    {name: "ភាសារខ្មែរ", code: "km"},
    { name: "မြန်မာ", code: "bm" },
  ]);
}

export function setTranslation() {
  return addTranslation({
    ...headers,
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
    ...priceTag,
    ...productUnit,
    ...brand,
    ...productType,
    ...productTag,
    ...variantAttribute,
    ...supplier,
    ...stockManagement,
    ...purchaseOrder,
    ...stockTransfer,
    ...stockAdjustmentRequest,
    ...stockAdjustmentApprove,
    ...returnPurchase,
    ...receivePurchase,
    ...reorderPoint,
    ...saleReport,
    ...inventoryReport,
    ...profitAndLostReport,
    ...saleHistory,
    ...homePage
  });
}