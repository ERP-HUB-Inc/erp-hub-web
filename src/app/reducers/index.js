import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethod from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";
import storeLocation from "../modules/pos/reducers/settings/storeLocation";

const reducer = combineReducers({ 
  user,
  tax,
  currency,
  storeLocation,
  paymentMethod: PaymentMethod.request,
  paymentMethodArchive: PaymentMethod.archive,
});

export default reducer;