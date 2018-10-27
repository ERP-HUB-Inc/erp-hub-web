import {combineReducers} from "redux";
import Constant from "../../constants/stock/purchaseOrder";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PURCHASE_ORDER_PENDING,
      Constant.REQUEST_PURCHASE_ORDER_REJECTED,
      Constant.REQUEST_PURCHASE_ORDER_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  requestOrderNumber: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PURCHASE_ORDER_NUMBER_PENDING,
      Constant.REQUEST_PURCHASE_ORDER_NUMBER_REJECTED,
      Constant.REQUEST_PURCHASE_ORDER_NUMBER_FULFILLED,
      Constant.RESET_REQUEST_PURCHASE_ORDER_NUMBER
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PURCHASE_ORDER_PENDING,
      Constant.ARCHIVE_PURCHASE_ORDER_REJECTED,
      Constant.ARCHIVE_PURCHASE_ORDER_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PURCHASE_ORDER_PENDING,
      Constant.ADD_PURCHASE_ORDER_REJECTED,
      Constant.ADD_PURCHASE_ORDER_FULFILLED, 
      Constant.SHOW_PURCHASE_ORDER_FORM,
      Constant.RESET_PURCHASE_ORDER
    ];
    return reducer.add(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_PURCHASE_ORDER_DETAIL_PENDING,
      Constant.REQUEST_PURCHASE_ORDER_DETAIL_REJECTED,
      Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULFILLED,
      Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET,
      Constant.REQUEST_PURCHASE_ORDER_DETAIL_RESET
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PURCHASE_ORDER_PENDING,
      Constant.UPDATE_PURCHASE_ORDER_REJECTED,
      Constant.UPDATE_PURCHASE_ORDER_FULFILLED,
      Constant.SHOW_PURCHASE_ORDER_FORM,
      Constant.RESET_PURCHASE_ORDER
    ];
    return reducer.update(state, action, constants);
  },
  pushToSupplier: (state = InitialState.update(), action) => {
    const constants = [
      Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_PENDING,
      Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_REJECTED,
      Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_FULFILLED,
      Constant.SHOW_PUSH_PURCHASE_ORDER_TO_SUPPLIER_FORM,
      Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_RESET
    ];
    return reducer.update(state, action, constants);
  }
});
