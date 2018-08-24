import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/stock/stockTransfer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_TRANSFER_PENDING,
      Constant.REQUEST_STOCK_TRANSFER_REJECTED,
      Constant.REQUEST_STOCK_TRANSFER_FULFILLED
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
      Constant.RESET_STOCK_TRANSFER
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_STOCK_TRANSFER_PENDING,
      Constant.UPDATE_STOCK_TRANSFER_REJECTED,
      Constant.UPDATE_STOCK_TRANSFER_FULFILLED,
      Constant.SHOW_STOCK_TRANSFER_FORM,
      Constant.RESET_STOCK_TRANSFER
    ];
    return reducer.update(state, action, constants);
  }
});
