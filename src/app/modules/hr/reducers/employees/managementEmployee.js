import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/employees/managementEmployee";
// import PaymentMethodSchema from "../../schemas/settings/paymentMethod";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_MANAGEMENT_EMPLOYEE_PENDING,
      Constant.REQUEST_MANAGEMENT_EMPLOYEE_REJECTED,
      Constant.REQUEST_MANAGEMENT_EMPLOYEE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_MANAGEMENT_EMPLOYEE_PENDING,
      Constant.ARCHIVE_MANAGEMENT_EMPLOYEE_REJECTED,
      Constant.ARCHIVE_MANAGEMENT_EMPLOYEE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_MANAGEMENT_EMPLOYEE_PENDING,
      Constant.ADD_MANAGEMENT_EMPLOYEE_REJECTED,
      Constant.ADD_MANAGEMENT_EMPLOYEE_FULFILLED,
      Constant.SHOW_MANAGEMENT_EMPLOYEE_FORM,
      Constant.RESET_MANAGEMENT_EMPLOYEE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_MANAGEMENT_EMPLOYEE_PENDING,
      Constant.UPDATE_MANAGEMENT_EMPLOYEE_REJECTED,
      Constant.UPDATE_MANAGEMENT_EMPLOYEE_FULFILLED,
      Constant.SHOW_MANAGEMENT_EMPLOYEE_FORM,
      Constant.RESET_MANAGEMENT_EMPLOYEE
    ];
    return reducer.update(state, action, constants);
  }
});
