import {combineReducers} from "redux";
import Constant from "../../constants/products/condition";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CONDITION_PENDING,
      Constant.REQUEST_CONDITION_REJECTED,
      Constant.REQUEST_CONDITION_FULFILLED,
      null,
      Constant.RESET_CONDITION
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CONDITION_PENDING,
      Constant.ARCHIVE_CONDITION_REJECTED,
      Constant.ARCHIVE_CONDITION_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CONDITION_PENDING,
      Constant.ADD_CONDITION_REJECTED,
      Constant.ADD_CONDITION_FULFILLED,
      Constant.SHOW_CONDITION_FORM,
      Constant.RESET_CONDITION
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_CONDITION_PENDING,
      Constant.UPDATE_CONDITION_REJECTED,
      Constant.UPDATE_CONDITION_FULFILLED,
      Constant.SHOW_CONDITION_FORM,
      Constant.RESET_CONDITION
    ];
    return reducer.update(state, action, constants);
  }
});
