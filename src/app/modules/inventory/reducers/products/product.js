import {combineReducers} from "redux";
import Constant from "../../constants/products/product";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRODUCT_PENDING,
      Constant.REQUEST_PRODUCT_REJECTED,
      Constant.REQUEST_PRODUCT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  search: (state = InitialState.request(), action) => {
    const constants = [
      Constant.SEARCH_PRODUCT_PENDING,
      Constant.SEARCH_PRODUCT_REJECTED,
      Constant.SEARCH_PRODUCT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PRODUCT_PENDING,
      Constant.ARCHIVE_PRODUCT_REJECTED,
      Constant.ARCHIVE_PRODUCT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PRODUCT_PENDING,
      Constant.ADD_PRODUCT_REJECTED,
      Constant.ADD_PRODUCT_FULFILLED,
      Constant.SHOW_PRODUCT_FORM,
      Constant.RESET_PRODUCT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PRODUCT_PENDING,
      Constant.UPDATE_PRODUCT_REJECTED,
      Constant.UPDATE_PRODUCT_FULFILLED,
      Constant.SHOW_PRODUCT_FORM,
      Constant.RESET_PRODUCT
    ];
    return reducer.update(state, action, constants);
  }
});
