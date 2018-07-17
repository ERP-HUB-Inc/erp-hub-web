import { combineReducers } from "redux";
import user from "../modules/common/reducers/user";
import paymentMethod from "../modules/pos/reducers/paymentMethod";
import tax from "../modules/pos/reducers/tax";

const reducer = combineReducers({ 
  user,
  paymentMethod,
  tax
});

export default reducer;