import {combineReducers} from "redux";
import Constant from "../../constants/customers/managementCutomers";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_MANAGEMENT_CUSTOMERS_PENDING,
      Constant.REQUEST_MANAGEMENT_CUSTOMERS_REJECTED,
      Constant.REQUEST_MANAGEMENT_CUSTOMERS_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_MANAGEMENT_CUSTOMERS_PENDING,
      Constant.ARCHIVE_MANAGEMENT_CUSTOMERS_REJECTED,
      Constant.ARCHIVE_MANAGEMENT_CUSTOMERS_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_MANAGEMENT_CUSTOMERS_PENDING,
      Constant.ADD_MANAGEMENT_CUSTOMERS_REJECTED,
      Constant.ADD_MANAGEMENT_CUSTOMERS_FULFILLED,
      Constant.SHOW_MANAGEMENT_CUSTOMERS_FORM,
      Constant.RESET_MANAGEMENT_CUSTOMERS
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_MANAGEMENT_CUSTOMERS_PENDING,
      Constant.UPDATE_MANAGEMENT_CUSTOMERS_REJECTED,
      Constant.UPDATE_MANAGEMENT_CUSTOMERS_FULFILLED,
      Constant.SHOW_MANAGEMENT_CUSTOMERS_FORM,
      Constant.RESET_MANAGEMENT_CUSTOMERS
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_CUSTOMERS_PENDING,
      Constant.DETAIL_CUSTOMERS_REJECTED,
      Constant.DETAIL_CUSTOMERS_FULFILLED,
      Constant.RESET_DETAIL_CUSTOMERS
    ];
    return reducer.detail(state, action, constants);
  },

});
