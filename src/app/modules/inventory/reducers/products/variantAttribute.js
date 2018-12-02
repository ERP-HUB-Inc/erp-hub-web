import {combineReducers} from "redux";
import Constant from "../../constants/products/variantAttribute";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_VARIANT_ATTRIBUTE_PENDING,
      Constant.REQUEST_VARIANT_ATTRIBUTE_REJECTED,
      Constant.REQUEST_VARIANT_ATTRIBUTE_FULFILLED,
      null,
      Constant.RESET_REQUEST_VARIANT_ATTRIBUTE
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_VARIANT_ATTRIBUTE_PENDING,
      Constant.ARCHIVE_VARIANT_ATTRIBUTE_REJECTED,
      Constant.ARCHIVE_VARIANT_ATTRIBUTE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_VARIANT_ATTRIBUTE_PENDING,
      Constant.ADD_VARIANT_ATTRIBUTE_REJECTED,
      Constant.ADD_VARIANT_ATTRIBUTE_FULFILLED,
      Constant.SHOW_VARIANT_ATTRIBUTE_FORM,
      Constant.RESET_VARIANT_ATTRIBUTE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_VARIANT_ATTRIBUTE_PENDING,
      Constant.UPDATE_VARIANT_ATTRIBUTE_REJECTED,
      Constant.UPDATE_VARIANT_ATTRIBUTE_FULFILLED,
      Constant.SHOW_VARIANT_ATTRIBUTE_FORM,
      Constant.RESET_VARIANT_ATTRIBUTE
    ];
    return reducer.update(state, action, constants);
  }
});
