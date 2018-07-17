import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";
import sidebar from "../languages/sidebar";
import text from "../elements/common/language/text";
import title from "../elements/common/language/title";
import IncomeAndExpense from "../../pos/languages/settings/IncomeAndExpense";
import PaymentMethod from "../../pos/languages/settings/PaymentMethod";
import ReceiptTemplate from "../../pos/languages/settings/ReceiptTemplate";
import RoleAccess from "../../pos/languages/settings/RoleAccess";
import StoreAccount from "../../pos/languages/settings/StoreAccount";
import StoreLocation from "../../pos/languages/settings/StoreLocation";
import Tax from "../../pos/languages/settings/Tax";

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
    ...IncomeAndExpense,
    ...PaymentMethod,
    ...ReceiptTemplate,
    ...RoleAccess,
    ...StoreAccount,
    ...StoreLocation,
    ...Tax
  });
}