import {combineReducers} from "redux";
import Constant from "../../constants/products/productsType";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CATEGORY_PENDING,
      Constant.REQUEST_CATEGORY_REJECTED,
      Constant.REQUEST_CATEGORY_FULFILLED,
      null,
      Constant.RESET_CATEGORY
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CATEGORY_PENDING,
      Constant.ARCHIVE_CATEGORY_REJECTED,
      Constant.ARCHIVE_CATEGORY_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CATEGORY_PENDING,
      Constant.ADD_CATEGORY_REJECTED,
      Constant.ADD_CATEGORY_FULFILLED,
      Constant.SHOW_CATEGORY_FORM,
      Constant.RESET_CATEGORY
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_CATEGORY_PENDING,
      Constant.UPDATE_CATEGORY_REJECTED,
      Constant.UPDATE_CATEGORY_FULFILLED,
      Constant.SHOW_CATEGORY_FORM,
      Constant.RESET_CATEGORY
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_CATEGORY_PENDING,
      Constant.DETAIL_CATEGORY_REJECTED,
      Constant.DETAIL_CATEGORY_FULFILLED,
      Constant.RESET_DETAIL_CATEGORY
    ];
    return reducer.detail(state, action, constants);
  }
});
