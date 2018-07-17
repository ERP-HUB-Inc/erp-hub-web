import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import PaymentMethod from "../modules/pos/reducers/paymentMethod";

const reducer = combineReducers({ 
  user,
  paymentMethod: PaymentMethod.request,
  paymentMethodArchive: PaymentMethod.archive,
});

export default reducer;