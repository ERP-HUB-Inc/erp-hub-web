import {combineReducers} from "redux";
import Constant from "../../constants/settings/storeAccount";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STORE_ACCOUNT_PENDING,
      Constant.REQUEST_STORE_ACCOUNT_REJECTED,
      Constant.REQUEST_STORE_ACCOUNT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_STORE_ACCOUNT_PENDING,
      Constant.ARCHIVE_STORE_ACCOUNT_REJECTED,
      Constant.ARCHIVE_STORE_ACCOUNT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_STORE_ACCOUNT_PENDING,
      Constant.ADD_STORE_ACCOUNT_REJECTED,
      Constant.ADD_STORE_ACCOUNT_FULFILLED,
      Constant.SHOW_STORE_ACCOUNT_FORM,
      Constant.RESET_STORE_ACCOUNT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_STORE_ACCOUNT_PENDING,
      Constant.UPDATE_STORE_ACCOUNT_REJECTED,
      Constant.UPDATE_STORE_ACCOUNT_FULFILLED,
      Constant.SHOW_STORE_ACCOUNT_FORM,
      Constant.RESET_STORE_ACCOUNT
    ];
    return reducer.update(state, action, constants);
  }
});
      