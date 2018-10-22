import {combineReducers} from "redux";
import Constant from "../../constants/employees/employee";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST__EMPLOYEE_PENDING,
      Constant.REQUEST__EMPLOYEE_REJECTED,
      Constant.REQUEST__EMPLOYEE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE__EMPLOYEE_PENDING,
      Constant.ARCHIVE__EMPLOYEE_REJECTED,
      Constant.ARCHIVE__EMPLOYEE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD__EMPLOYEE_PENDING,
      Constant.ADD__EMPLOYEE_REJECTED,
      Constant.ADD__EMPLOYEE_FULFILLED,
      Constant.SHOW__EMPLOYEE_FORM,
      Constant.RESET__EMPLOYEE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE__EMPLOYEE_PENDING,
      Constant.UPDATE__EMPLOYEE_REJECTED,
      Constant.UPDATE__EMPLOYEE_FULFILLED,
      Constant.SHOW__EMPLOYEE_FORM,
      Constant.RESET__EMPLOYEE
    ];
    return reducer.update(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL__EMPLOYEE_PENDING,
      Constant.DETAIL__EMPLOYEE_REJECTED,
      Constant.DETAIL__EMPLOYEE_FULFILLED,
      Constant.RESET_DETAIL__EMPLOYEE
    ];
    return reducer.detail(state, action, constants);
  },
});
