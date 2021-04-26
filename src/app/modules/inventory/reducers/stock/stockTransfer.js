import {combineReducers} from "redux";
import Constant from "../../constants/stock/stockTransfer";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_TRANSFER_PENDING,
      Constant.REQUEST_STOCK_TRANSFER_REJECTED,
      Constant.REQUEST_STOCK_TRANSFER_FULFILLED,
      null,
      Constant.RESET_REQUEST_STOCK_TRANSFER
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_STOCK_TRANSFER_PENDING,
      Constant.ARCHIVE_STOCK_TRANSFER_REJECTED,
      Constant.ARCHIVE_STOCK_TRANSFER_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_STOCK_TRANSFER_PENDING,
      Constant.ADD_STOCK_TRANSFER_REJECTED,
      Constant.ADD_STOCK_TRANSFER_FULFILLED,
      Constant.SHOW_STOCK_TRANSFER_FORM,
      Constant.RESET_ADD_STOCK_TRANSFER,
      Constant.RESET_ADD_PARTIAL_STOCK_TRANSFER
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_STOCK_TRANSFER_PENDING,
      Constant.UPDATE_STOCK_TRANSFER_REJECTED,
      Constant.UPDATE_STOCK_TRANSFER_FULFILLED,
      Constant.SHOW_STOCK_TRANSFER_FORM,
      Constant.RESET_UPDATE_STOCK_TRANSFER,
      Constant.RESET_UPDATE_PARTIAL_STOCK_TRANSFER
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_TRANSFER_DETAIL_PENDING,
      Constant.REQUEST_STOCK_TRANSFER_DETAIL_REJECTED,
      Constant.REQUEST_STOCK_TRANSFER_DETAIL_FULFILLED,
      Constant.REQUEST_STOCK_TRANSFER_DETAIL_FULL_RESET,
      Constant.REQUEST_STOCK_TRANSFER_DETAIL_RESET
    ];
    return reducer.detail(state, action, constants);
  },
  approve: (state = InitialState.update(), action) => {
    const constants = [
      Constant.APPROVE_STOCK_TRANSFER_PENDING,
      Constant.APPROVE_STOCK_TRANSFER_REJECTED,
      Constant.APPROVE_STOCK_TRANSFER_FULFILLED,
      null,
      Constant.RESET_APPROVE_STOCK_TRANSFER
    ];
    return reducer.update(state, action, constants);
  },
  cancel: (state = InitialState.update(), action) => {
    const constants = [
      Constant.CANCEL_STOCK_TRANSFER_PENDING,
      Constant.CANCEL_STOCK_TRANSFER_REJECTED,
      Constant.CANCEL_STOCK_TRANSFER_FULFILLED,
      null,
      Constant.RESET_CANCEL_STOCK_TRANSFER
    ];
    return reducer.update(state, action, constants);
  }
});
