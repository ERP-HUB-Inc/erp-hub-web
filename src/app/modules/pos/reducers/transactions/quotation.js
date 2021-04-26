import {combineReducers} from "redux";
import reducer from "../../../common/reducers/reducer";
import Constant from "../../constants/transactions/quotation";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_QUOTATION_PENDING,
      Constant.REQUEST_QUOTATION_REJECTED,
      Constant.REQUEST_QUOTATION_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_QUOTATION_PENDING,
      Constant.ARCHIVE_QUOTATION_REJECTED,
      Constant.ARCHIVE_QUOTATION_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_QUOTATION_PENDING,
      Constant.ADD_QUOTATION_REJECTED,
      Constant.ADD_QUOTATION_FULFILLED,
      Constant.SHOW_QUOTATION_FORM,
      Constant.RESET_QUOTATION
    ];
    return reducer.add(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_QUOTATION_PENDING,
      Constant.DETAIL_QUOTATION_REJECTED,
      Constant.DETAIL_QUOTATION_FULFILLED,
      Constant.RESET_DETAIL_QUOTATION,
      Constant.PARTIAL_RESET_DETAIL_QUOTATION
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_QUOTATION_PENDING,
      Constant.UPDATE_QUOTATION_REJECTED,
      Constant.UPDATE_QUOTATION_FULFILLED,
      Constant.SHOW_QUOTATION_FORM,
      Constant.RESET_QUOTATION
    ];
    return reducer.update(state, action, constants);
  }
  
});
