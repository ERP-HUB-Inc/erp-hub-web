import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethod from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/settings/tax";
import currency from "../modules/pos/reducers/settings/currency";

const reducer = combineReducers({ 
  user,
  tax,
  currency,
  paymentMethod: PaymentMethod.request,
  paymentMethodArchive: PaymentMethod.archive,
});

export default reducer;