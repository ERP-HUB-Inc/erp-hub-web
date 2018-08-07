import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/settings/operationRecord";
import InitialState from "../../../common/reducers/initialState";
  
export default combineReducers ({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_OPERATION_RECORD_PENDING,
      Constant.REQUEST_OPERATION_RECORD_REJECTED,
      Constant.REQUEST_OPERATION_RECORD_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_OPERATION_RECORD_PENDING,
      Constant.ARCHIVE_OPERATION_RECORD_REJECTED,
      Constant.ARCHIVE_OPERATION_RECORD_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_OPERATION_RECORD_PENDING,
      Constant.ADD_OPERATION_RECORD_REJECTED,
      Constant.ADD_OPERATION_RECORD_FULFILLED,
      Constant.SHOW_OPERATION_RECORD_FORM,
      Constant.RESET_OPERATION_RECORD
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_OPERATION_RECORD_PENDING,
      Constant.UPDATE_OPERATION_RECORD_REJECTED,
      Constant.UPDATE_OPERATION_RECORD_FULFILLED,
      Constant.SHOW_OPERATION_RECORD_FORM,
      Constant.RESET_OPERATION_RECORD
    ];
    return reducer.update(state, action, constants);
  }
});
  
  