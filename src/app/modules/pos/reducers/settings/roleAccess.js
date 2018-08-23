import {combineReducers} from "redux";
import Constant from "../../constants/settings/roleAccess";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_ROLE_ACCESS_PENDING,
      Constant.REQUEST_ROLE_ACCESS_REJECTED,
      Constant.REQUEST_ROLE_ACCESS_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_ROLE_ACCESS_PENDING,
      Constant.ARCHIVE_ROLE_ACCESS_REJECTED,
      Constant.ARCHIVE_ROLE_ACCESS_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_ROLE_ACCESS_PENDING,
      Constant.ADD_ROLE_ACCESS_REJECTED,
      Constant.ADD_ROLE_ACCESS_FULFILLED,
      Constant.SHOW_ROLE_ACCESS_FORM,
      Constant.RESET_ROLE_ACCESS
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_ROLE_ACCESS_PENDING,
      Constant.UPDATE_ROLE_ACCESS_REJECTED,
      Constant.UPDATE_ROLE_ACCESS_FULFILLED,
      Constant.SHOW_ROLE_ACCESS_FORM,
      Constant.RESET_ROLE_ACCESS
    ];
    return reducer.update(state, action, constants);
  }
});
      