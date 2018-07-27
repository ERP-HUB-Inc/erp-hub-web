import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/currency";
import InitialState from "./initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CURRENCY_PENDING,
      Constant.REQUEST_CURRENCY_REJECTED,
      Constant.REQUEST_CURRENCY_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
    