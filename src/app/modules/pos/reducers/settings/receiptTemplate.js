import {combineReducers} from "redux";
import Constant from "../../constants/settings/receiptTemplate";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
  
export default combineReducers ({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_RECEIPT_PENDING,
      Constant.REQUEST_RECEIPT_REJECTED,
      Constant.REQUEST_RECEIPT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_RECEIPT_PENDING,
      Constant.ARCHIVE_RECEIPT_REJECTED,
      Constant.ARCHIVE_RECEIPT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_RECEIPT_PENDING,
      Constant.ADD_RECEIPT_REJECTED,
      Constant.ADD_RECEIPT_FULFILLED,
      Constant.SHOW_RECEIPT_FORM,
      Constant.RESET_RECEIPT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_RECEIPT_PENDING,
      Constant.UPDATE_RECEIPT_REJECTED,
      Constant.UPDATE_RECEIPT_FULFILLED,
      Constant.SHOW_RECEIPT_FORM,
      Constant.RESET_RECEIPT
    ];
    return reducer.update(state, action, constants);
  }
});
  
  