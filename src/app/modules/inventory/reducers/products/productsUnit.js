import {combineReducers} from "redux";
import Constant from "../../constants/products/productsUnit";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_UNIT_PENDING,
      Constant.REQUEST_UNIT_REJECTED,
      Constant.REQUEST_UNIT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_UNIT_PENDING,
      Constant.ARCHIVE_UNIT_REJECTED,
      Constant.ARCHIVE_UNIT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_UNIT_PENDING,
      Constant.ADD_UNIT_REJECTED,
      Constant.ADD_UNIT_FULFILLED,
      Constant.SHOW_UNIT_FORM,
      Constant.RESET_UNIT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_UNIT_PENDING,
      Constant.UPDATE_UNIT_REJECTED,
      Constant.UPDATE_UNIT_FULFILLED,
      Constant.SHOW_UNIT_FORM,
      Constant.RESET_UNIT
    ];
    return reducer.update(state, action, constants);
  }
});
