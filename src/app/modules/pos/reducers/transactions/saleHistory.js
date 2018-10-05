import {combineReducers} from "redux";
import Constant from "../../constants/transactions/saleHistory";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_SALE_HISTORY_PENDING,
      Constant.REQUEST_SALE_HISTORY_REJECTED,
      Constant.REQUEST_SALE_HISTORY_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_SALE_HISTORY_PENDING,
      Constant.ARCHIVE_SALE_HISTORY_REJECTED,
      Constant.ARCHIVE_SALE_HISTORY_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_SALE_HISTORY_PENDING,
      Constant.ADD_SALE_HISTORY_REJECTED,
      Constant.ADD_SALE_HISTORY_FULFILLED,
      Constant.SHOW_SALE_HISTORY_FORM,
      Constant.RESET_SALE_HISTORY
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_SALE_HISTORY_PENDING,
      Constant.UPDATE_SALE_HISTORY_REJECTED,
      Constant.UPDATE_SALE_HISTORY_FULFILLED,
      Constant.SHOW_SALE_HISTORY_FORM,
      Constant.RESET_SALE_HISTORY
    ];
    return reducer.update(state, action, constants);
  }
});
    