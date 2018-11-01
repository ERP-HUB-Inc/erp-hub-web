import Constant from "../../constants/employees/employee";
import EmployeeService from "../../services/employees/EmployeeService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_EMPLOYEE,
        payload: EmployeeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_EMPLOYEE,
        payload: EmployeeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_EMPLOYEE,
        payload: EmployeeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_EMPLOYEE,
        payload: EmployeeService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_EMPLOYEE) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_EMPLOYEE_FORM,
        payload: data
      });
    };
  },
  detail: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_EMPLOYEE,
        payload:  EmployeeService.profile(id)
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_EMPLOYEE,
        payload: EmployeeService.detail(data.id)
      });
    };
  }
};

