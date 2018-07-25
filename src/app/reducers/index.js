import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethods from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";
import storeLocation from "../modules/pos/reducers/settings/storeLocation";
import storeLanguage from "../modules/pos/reducers/settings/storeLanguage";

const reducer = combineReducers({
  // SETTING MODULE
  user,
  tax,
  currency,
  storeLocation,
  storeLanguage,
  PaymentMethods
});

export default reducer;