import {combineReducers} from "redux";
import Constant from "../../constants/employees/employee";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_EMPLOYEE_PENDING,
      Constant.REQUEST_EMPLOYEE_REJECTED,
      Constant.REQUEST_EMPLOYEE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_EMPLOYEE_PENDING,
      Constant.ARCHIVE_EMPLOYEE_REJECTED,
      Constant.ARCHIVE_EMPLOYEE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_EMPLOYEE_PENDING,
      Constant.ADD_EMPLOYEE_REJECTED,
      Constant.ADD_EMPLOYEE_FULFILLED,
      Constant.SHOW_EMPLOYEE_FORM,
      Constant.RESET_EMPLOYEE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_EMPLOYEE_PENDING,
      Constant.UPDATE_EMPLOYEE_REJECTED,
      Constant.UPDATE_EMPLOYEE_FULFILLED,
      Constant.SHOW_EMPLOYEE_FORM,
      Constant.RESET_EMPLOYEE
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_EMPLOYEE_PENDING,
      Constant.DETAIL_EMPLOYEE_REJECTED,
      Constant.DETAIL_EMPLOYEE_FULFILLED,
      Constant.RESET_DETAIL_EMPLOYEE
    ];
    return reducer.detail(state, action, constants);
  },
});
