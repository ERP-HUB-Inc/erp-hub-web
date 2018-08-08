import Constant from "../../constants/settings/privilege";
import { combineReducers } from "redux";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRIVILEGE_PENDING,
      Constant.REQUEST_PRIVILEGE_REJECTED,
      Constant.REQUEST_PRIVILEGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
      