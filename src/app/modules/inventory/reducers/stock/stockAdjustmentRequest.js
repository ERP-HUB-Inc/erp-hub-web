import {combineReducers} from "redux";
import Constant from "../../constants/stock/stockAdjustmentRequest";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_PENDING,
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_REJECTED,
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_FULFILLED,
      Constant.RESET_REQUEST_STOCK_ADJUSTMENT_REQUEST
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_STOCK_ADJUSTMENT_REQUEST_PENDING,
      Constant.ARCHIVE_STOCK_ADJUSTMENT_REQUEST_REJECTED,
      Constant.ARCHIVE_STOCK_ADJUSTMENT_REQUEST_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_STOCK_ADJUSTMENT_REQUEST_PENDING,
      Constant.ADD_STOCK_ADJUSTMENT_REQUEST_REJECTED,
      Constant.ADD_STOCK_ADJUSTMENT_REQUEST_FULFILLED, 
      Constant.SHOW_STOCK_ADJUSTMENT_REQUEST_FORM,
      Constant.RESET_STOCK_ADJUSTMENT_REQUEST,
      Constant.RESET_ADD_STOCK_ADJUSTMENT_REQUEST
    ];
    return reducer.add(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_DETAIL_PENDING,
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_DETAIL_REJECTED,
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_DETAIL_FULFILLED,
      Constant.RESET_STOCK_ADJUSTMENT_FULL_RESET,
      Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_DETAIL_RESET
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_STOCK_ADJUSTMENT_REQUEST_PENDING,
      Constant.UPDATE_STOCK_ADJUSTMENT_REQUEST_REJECTED,
      Constant.UPDATE_STOCK_ADJUSTMENT_REQUEST_FULFILLED,
      Constant.SHOW_STOCK_ADJUSTMENT_REQUEST_FORM,
      Constant.RESET_STOCK_ADJUSTMENT_REQUEST
    ];
    return reducer.update(state, action, constants);
  }
});
