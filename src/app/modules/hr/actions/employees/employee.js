import Constant from "../../constants/employees/employee";
import EmployeeService from "../../services/employees/EmployeeService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_EMPLOYEE,
        payload: EmployeeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_MANAGEMENT_EMPLOYEE,
        payload: EmployeeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_MANAGEMENT_EMPLOYEE,
        payload: EmployeeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_MANAGEMENT_EMPLOYEE,
        payload: EmployeeService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_MANAGEMENT_EMPLOYEE,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_MANAGEMENT_EMPLOYEE_FORM,
        payload: data
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_MANAGEMENT_EMPLOYEE,
        payload: EmployeeService.detail(data.id)
      });
    };
  }
};

