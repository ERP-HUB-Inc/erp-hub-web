import {combineReducers} from "redux";
import Constant from "../../constants/settings/privilege";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
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
      