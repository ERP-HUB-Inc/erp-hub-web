import Constant from "../../constants/customers/managementCutomers";
import managementEmployeeService from "../../services/customers/CustomerService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_CUSTOMERS,
        payload: managementEmployeeService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
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
  reset: (RESET_CONSTANT) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: () => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_MANAGEMENT_CUSTOMERS_FORM,
        payload: null
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_CUSTOMERS,
        payload: managementEmployeeService.detail(data.id)
      });
    };
  }
};

