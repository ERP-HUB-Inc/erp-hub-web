import {combineReducers} from "redux";
import Constant from "../../constants/stock/stockAdjustmentApprove";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_PENDING,
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_REJECTED,
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_FULFILLED,
      Constant.RESET_REQUEST_STOCK_ADJUSTMENT_APPROVE
    ];
    return reducer.request(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_DETAIL_PENDING,
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_DETAIL_REJECTED,
      Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_DETAIL_FULFILLED,
      Constant.RESET_STOCK_ADJUSTMENT_APPROVE
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_STOCK_ADJUSTMENT_APPROVE_PENDING,
      Constant.UPDATE_STOCK_ADJUSTMENT_APPROVE_REJECTED,
      Constant.UPDATE_STOCK_ADJUSTMENT_APPROVE_FULFILLED,
      Constant.SHOW_STOCK_ADJUSTMENT_APPROVE_FORM,
      Constant.RESET_STOCK_ADJUSTMENT_APPROVE
    ];
    return reducer.update(state, action, constants);
  }
});
