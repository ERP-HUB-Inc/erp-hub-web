import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethod from "../modules/pos/reducers/settings/paymentMethod";
import tax from "../modules/pos/reducers/tax";

const reducer = combineReducers({ 
  user,
  tax,
  paymentMethod: PaymentMethod.request,
  paymentMethodArchive: PaymentMethod.archive,
});

export default reducer;