import { combineReducers } from "redux";
import Constant from "../../constants/stock/returnPurchase";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_RETURN_PURCHASE_PENDING,
      Constant.REQUEST_RETURN_PURCHASE_REJECTED,
      Constant.REQUEST_RETURN_PURCHASE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_RETURN_PURCHASE_PENDING,
      Constant.ARCHIVE_RETURN_PURCHASE_REJECTED,
      Constant.ARCHIVE_RETURN_PURCHASE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_RETURN_PURCHASE_PENDING,
      Constant.ADD_RETURN_PURCHASE_REJECTED,
      Constant.ADD_RETURN_PURCHASE_FULFILLED,
      Constant.SHOW_RETURN_PURCHASE_FORM,
      Constant.RESET_RETURN_PURCHASE
    ];
    return reducer.add(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_RETURN_PURCHASE_DETAIL_PENDING,
      Constant.REQUEST_RETURN_PURCHASE_DETAIL_REJECTED,
      Constant.REQUEST_RETURN_PURCHASE_DETAIL_FULFILLED, 
      Constant.RESET_RETURN_PURCHASE
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_RETURN_PURCHASE_PENDING,
      Constant.UPDATE_RETURN_PURCHASE_REJECTED,
      Constant.UPDATE_RETURN_PURCHASE_FULFILLED,
      Constant.SHOW_RETURN_PURCHASE_FORM,
      Constant.RESET_RETURN_PURCHASE
    ];
    return reducer.update(state, action, constants);
  }
});
