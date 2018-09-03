import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/stock/reorderPoint";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_REORDER_POINT_PENDING,
      Constant.REQUEST_REORDER_POINT_REJECTED,
      Constant.REQUEST_REORDER_POINT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_REORDER_POINT_PENDING,
      Constant.ARCHIVE_REORDER_POINT_REJECTED,
      Constant.ARCHIVE_REORDER_POINT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_REORDER_POINT_PENDING,
      Constant.ADD_REORDER_POINT_REJECTED,
      Constant.ADD_REORDER_POINT_FULFILLED,
      Constant.SHOW_REORDER_POINT_FORM,
      Constant.RESET_REORDER_POINT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_REORDER_POINT_PENDING,
      Constant.UPDATE_REORDER_POINT_REJECTED,
      Constant.UPDATE_REORDER_POINT_FULFILLED,
      Constant.SHOW_REORDER_POINT_FORM,
      Constant.RESET_REORDER_POINT
    ];
    return reducer.update(state, action, constants);
  }
});
