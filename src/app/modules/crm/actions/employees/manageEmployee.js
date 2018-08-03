import Constant from "../../constants/employees/managementEmployee";
import managementEmployeeService from "../../services/employees/manageEmployee";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_EMPLOYEE,
        payload: managementEmployeeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_MANAGEMENT_EMPLOYEE,
        payload: managementEmployeeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_MANAGEMENT_EMPLOYEE,
        payload: managementEmployeeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_MANAGEMENT_EMPLOYEE,
        payload: managementEmployeeService.update(data)
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
  }
};

