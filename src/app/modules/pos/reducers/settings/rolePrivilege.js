import Constant from "../../constants/settings/rolePrivilege";
import {combineReducers} from "redux";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_ROLE_PRIVILEGE_PENDING,
      Constant.REQUEST_ROLE_PRIVILEGE_REJECTED,
      Constant.REQUEST_ROLE_PRIVILEGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_ROLE_PRIVILEGE_PENDING,
      Constant.UPDATE_ROLE_PRIVILEGE_REJECTED,
      Constant.UPDATE_ROLE_PRIVILEGE_FULFILLED
    ];
    return reducer.update(state, action, constants);
  }
});
      