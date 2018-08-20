import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/products/brand";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_BRAND_PENDING,
      Constant.REQUEST_BRAND_REJECTED,
      Constant.REQUEST_BRAND_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_BRAND_PENDING,
      Constant.ARCHIVE_BRAND_REJECTED,
      Constant.ARCHIVE_BRAND_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_BRAND_PENDING,
      Constant.ADD_BRAND_REJECTED,
      Constant.ADD_BRAND_FULFILLED,
      Constant.SHOW_BRAND_FORM,
      Constant.RESET_BRAND
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_BRAND_PENDING,
      Constant.UPDATE_BRAND_REJECTED,
      Constant.UPDATE_BRAND_FULFILLED,
      Constant.SHOW_BRAND_FORM,
      Constant.RESET_BRAND
    ];
    return reducer.update(state, action, constants);
  }
});
