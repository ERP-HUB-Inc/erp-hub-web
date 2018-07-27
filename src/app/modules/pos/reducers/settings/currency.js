import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/settings/currency";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CURRENCY_PENDING,
      Constant.REQUEST_CURRENCY_REJECTED,
      Constant.REQUEST_CURRENCY_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CURRENCY_PENDING,
      Constant.ARCHIVE_CURRENCY_REJECTED,
      Constant.ARCHIVE_CURRENCY_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CURRENCY_PENDING,
      Constant.ADD_CURRENCY_REJECTED,
      Constant.ADD_CURRENCY_FULFILLED,
      Constant.SHOW_CURRENCY_FORM,
      Constant.RESET_CURRENCY
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_CURRENCY_PENDING,
      Constant.UPDATE_CURRENCY_REJECTED,
      Constant.UPDATE_CURRENCY_FULFILLED,
      Constant.SHOW_CURRENCY_FORM,
      Constant.RESET_CURRENCY
    ];
    return reducer.update(state, action, constants);
  }
});
    