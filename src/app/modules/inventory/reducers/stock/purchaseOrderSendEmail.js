import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/stock/purchaseOrderSendEmail";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PURCHASE_ORDER_SEND_EMAIL_PENDING,
      Constant.REQUEST_PURCHASE_ORDER_SEND_EMAIL_REJECTED,
      Constant.REQUEST_PURCHASE_ORDER_SEND_EMAIL_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PURCHASE_ORDER_SEND_EMAIL_PENDING,
      Constant.ARCHIVE_PURCHASE_ORDER_SEND_EMAIL_REJECTED,
      Constant.ARCHIVE_PURCHASE_ORDER_SEND_EMAIL_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PURCHASE_ORDER_SEND_EMAIL_PENDING,
      Constant.ADD_PURCHASE_ORDER_SEND_EMAIL_REJECTED,
      Constant.ADD_PURCHASE_ORDER_SEND_EMAIL_FULFILLED,
      Constant.SHOW_EMAIL_FORM_PURCHASE_ORDER,
      Constant.RESET_SHOW_FORM_EMAIL_PURCHASE_ORDER
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PURCHASE_ORDER_SEND_EMAIL_PENDING,
      Constant.UPDATE_PURCHASE_ORDER_SEND_EMAIL_REJECTED,
      Constant.UPDATE_PURCHASE_ORDER_SEND_EMAIL_FULFILLED,
      Constant.SHOW_EMAIL_FORM_PURCHASE_ORDER,
      Constant.RESET_SHOW_FORM_EMAIL_PURCHASE_ORDER
    ];
    return reducer.update(state, action, constants);
  }
});
