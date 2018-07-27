import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/language";
import InitialState from "./initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_LANGUAGE_PENDING,
      Constant.REQUEST_LANGUAGE_REJECTED,
      Constant.REQUEST_LANGUAGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
    