import Constant from "../../constants/customers/managementCutomers";
import managementEmployeeService from "../../services/customers/manageCustomer";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_CUSTOMERS,
        payload: managementEmployeeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },

  fetchGroup: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_GROUP_CUSTOMERS,
        payload: managementEmployeeService.fetchGroup()
      });
    };
  },

  fetchExpend:(ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_EXTEND_FETCH_CUSTOMERS,
        payload: managementEmployeeService.detail(ids)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_MANAGEMENT_CUSTOMERS,
        payload: managementEmployeeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_MANAGEMENT_CUSTOMERS,
        payload: managementEmployeeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_MANAGEMENT_CUSTOMERS,
        payload: managementEmployeeService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_MANAGEMENT_CUSTOMERS,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_MANAGEMENT_CUSTOMERS_FORM,
        payload: data
      });
    };
  }
};

