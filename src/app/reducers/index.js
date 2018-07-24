import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethod from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";
import storeLocation from "../modules/pos/reducers/settings/storeLocation";
import storeLanguage from "../modules/pos/reducers/settings/storeLanguage";

const reducer = combineReducers({
  // SETTING MODULE
  user,
  tax: tax.request,
  taxAdd: tax.add,
  taxUpdate: tax.update,
  taxArchive: tax.archive,

  currency: currency.request,
  currencyAdd: currency.add,
  currencyUpdate: currency.update,

  storeLocation: storeLocation.request,
  storeLocationAdd: storeLocation.add,
  storeLocationUpdate: storeLocation.update,

  storeLanguage: storeLanguage.request,
  storeLanguageAdd: storeLanguage.add,
  storeLanguageUpdate: storeLanguage.update,
  
  paymentMethod: PaymentMethod.request,
  paymentMethodArchive: PaymentMethod.archive,
  paymentMethodAdd: PaymentMethod.add,
  paymentMethodUpdate: PaymentMethod.update,
});

export default reducer;