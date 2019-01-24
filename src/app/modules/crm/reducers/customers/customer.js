import {combineReducers} from "redux";
import Constant from "../../constants/customers/customer";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CUSTOMERS_PENDING,
      Constant.REQUEST_CUSTOMERS_REJECTED,
      Constant.REQUEST_CUSTOMERS_FULFILLED,
      Constant.REQUEST_CUSTOMERS_RESET
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CUSTOMERS_PENDING,
      Constant.ARCHIVE_CUSTOMERS_REJECTED,
      Constant.ARCHIVE_CUSTOMERS_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CUSTOMERS_PENDING,
      Constant.ADD_CUSTOMERS_REJECTED,
      Constant.ADD_CUSTOMERS_FULFILLED,
      Constant.SHOW_CUSTOMERS_FORM,
      Constant.RESET_CUSTOMERS,
      Constant.RESET_ADD_CUSTOMERS
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_CUSTOMERS_PENDING,
      Constant.UPDATE_CUSTOMERS_REJECTED,
      Constant.UPDATE_CUSTOMERS_FULFILLED,
      Constant.SHOW_CUSTOMERS_FORM,
      Constant.RESET_CUSTOMERS
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_CUSTOMERS_PENDING,
      Constant.DETAIL_CUSTOMERS_REJECTED,
      Constant.DETAIL_CUSTOMERS_FULFILLED,
      Constant.RESET_DETAIL_CUSTOMERS,
      Constant.RESET_DETAIL_PARTIAL_CUSTOMERS
    ];
    return reducer.detail(state, action, constants);
  },

});
