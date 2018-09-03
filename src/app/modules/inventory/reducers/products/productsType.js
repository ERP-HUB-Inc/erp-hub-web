import {combineReducers} from "redux";
import Constant from "../../constants/products/productsType";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRODUCTS_TYPE_PENDING,
      Constant.REQUEST_PRODUCTS_TYPE_REJECTED,
      Constant.REQUEST_PRODUCTS_TYPE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PRODUCTS_TYPE_PENDING,
      Constant.ARCHIVE_PRODUCTS_TYPE_REJECTED,
      Constant.ARCHIVE_PRODUCTS_TYPE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PRODUCTS_TYPE_PENDING,
      Constant.ADD_PRODUCTS_TYPE_REJECTED,
      Constant.ADD_PRODUCTS_TYPE_FULFILLED,
      Constant.SHOW_PRODUCTS_TYPE_FORM,
      Constant.RESET_PRODUCTS_TYPE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PRODUCTS_TYPE_PENDING,
      Constant.UPDATE_PRODUCTS_TYPE_REJECTED,
      Constant.UPDATE_PRODUCTS_TYPE_FULFILLED,
      Constant.SHOW_PRODUCTS_TYPE_FORM,
      Constant.RESET_PRODUCTS_TYPE
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_PRODUCTS_TYPE_PENDING,
      Constant.DETAIL_PRODUCTS_TYPE_REJECTED,
      Constant.DETAIL_PRODUCTS_TYPE_FULFILLED,
      Constant.RESET_DETAIL_PRODUCTS_TYPE
    ];
    return reducer.detail(state, action, constants);
  }
});
