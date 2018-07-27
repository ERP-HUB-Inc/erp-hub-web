import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/businessType";
import InitialState from "./initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_BUSINESS_TYPE_PENDING,
      Constant.REQUEST_BUSINESS_TYPE_REJECTED,
      Constant.REQUEST_BUSINESS_TYPE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
    