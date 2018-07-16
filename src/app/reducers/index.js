import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import paymentMethod from "../modules/pos/reducers/paymentMethod";

const reducer = combineReducers({ 
  user,
  paymentMethod
});

export default reducer;