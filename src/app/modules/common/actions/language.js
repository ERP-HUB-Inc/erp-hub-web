import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";
import sidebar from "../languages/sidebar";
import text from "../elements/common/language/text";
import title from "../elements/common/language/title";
import modal from "../../pos/languages/shares/modal";
import incomeAndExpense from "../../pos/languages/settings/incomeAndExpense";
import paymentMethod from "../../pos/languages/settings/paymentMethod";
import receiptTemplate from "../../pos/languages/settings/receiptTemplate";
// import roleAccess from "../../pos/languages/settings/roleAccess";
import storeAccount from "../../pos/languages/settings/storeAccount";
import storeLocation from "../../pos/languages/settings/storeLocation";
import tax from "../../pos/languages/settings/tax";
import operationRecord from "../../pos/languages/settings/operationRecord";
import error from "../elements/common/language/error";

export function initLanguage() {
  return initialize([
    { name: "English", code: "en" },
    { name: "Myanmar", code: "my" }
  ]);
}

export function setTranslation() {
  return addTranslation({
    ...headers,
    ...footers,
    ...text,
    ...title,
    ...error,
    ...sidebar,
    ...modal,
    ...incomeAndExpense,
    ...paymentMethod,
    ...receiptTemplate,
    ...storeAccount,
    ...storeLocation,
    ...tax,
    ...operationRecord
  });
}