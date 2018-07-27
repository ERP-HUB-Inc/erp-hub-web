import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/businessPlan";
import InitialState from "./initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_BUSINESS_PLAN_PENDING,
      Constant.REQUEST_BUSINESS_PLAN_REJECTED,
      Constant.REQUEST_BUSINESS_PLAN_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
    