import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/products/productsTag";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRODUCTS_TAG_PENDING,
      Constant.REQUEST_PRODUCTS_TAG_REJECTED,
      Constant.REQUEST_PRODUCTS_TAG_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PRODUCTS_TAG_PENDING,
      Constant.ARCHIVE_PRODUCTS_TAG_REJECTED,
      Constant.ARCHIVE_PRODUCTS_TAG_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PRODUCTS_TAG_PENDING,
      Constant.ADD_PRODUCTS_TAG_REJECTED,
      Constant.ADD_PRODUCTS_TAG_FULFILLED,
      Constant.SHOW_PRODUCTS_TAG_FORM,
      Constant.RESET_PRODUCTS_TAG
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PRODUCTS_TAG_PENDING,
      Constant.UPDATE_PRODUCTS_TAG_REJECTED,
      Constant.UPDATE_PRODUCTS_TAG_FULFILLED,
      Constant.SHOW_PRODUCTS_TAG_FORM,
      Constant.RESET_PRODUCTS_TAG
    ];
    return reducer.update(state, action, constants);
  }
});
