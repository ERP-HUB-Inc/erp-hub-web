import {combineReducers} from "redux";
import Constant from "../../constants/stock/supplier";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_SUPPLIER_PENDING,
      Constant.REQUEST_SUPPLIER_REJECTED,
      Constant.REQUEST_SUPPLIER_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_SUPPLIER_DETAIL_PENDING,
      Constant.REQUEST_SUPPLIER_DETAIL_REJECTED,
      Constant.REQUEST_SUPPLIER_DETAIL_FULFILLED
    ];
    return reducer.detail(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_SUPPLIER_PENDING,
      Constant.ARCHIVE_SUPPLIER_REJECTED,
      Constant.ARCHIVE_SUPPLIER_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_SUPPLIER_PENDING,
      Constant.ADD_SUPPLIER_REJECTED,
      Constant.ADD_SUPPLIER_FULFILLED,
      Constant.SHOW_SUPPLIER_FORM,
      Constant.RESET_SUPPLIER
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_SUPPLIER_PENDING,
      Constant.UPDATE_SUPPLIER_REJECTED,
      Constant.UPDATE_SUPPLIER_FULFILLED,
      Constant.SHOW_SUPPLIER_FORM,
      Constant.RESET_SUPPLIER
    ];
    return reducer.update(state, action, constants);
  }
});
