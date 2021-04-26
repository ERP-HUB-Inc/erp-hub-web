import {combineReducers} from "redux";
import Constant from "../../constants/settings/tax";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
  
export default combineReducers ({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_TAX_PENDING,
      Constant.REQUEST_TAX_REJECTED,
      Constant.REQUEST_TAX_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_TAX_PENDING,
      Constant.ARCHIVE_TAX_REJECTED,
      Constant.ARCHIVE_TAX_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_TAX_PENDING,
      Constant.ADD_TAX_REJECTED,
      Constant.ADD_TAX_FULFILLED,
      Constant.SHOW_TAX_FORM,
      Constant.RESET_TAX
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_TAX_PENDING,
      Constant.UPDATE_TAX_REJECTED,
      Constant.UPDATE_TAX_FULFILLED,
      Constant.SHOW_TAX_FORM,
      Constant.RESET_TAX
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_TAX_PENDING,
      Constant.DETAIL_TAX_REJECTED,
      Constant.DETAIL_TAX_FULFILLED
    ];
    return reducer.detail(state, action, constants);
  }
});
  
  