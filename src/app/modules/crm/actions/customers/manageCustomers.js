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
        type: Constant.RESET_DETAIL_CUSTOMERS,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_CUSTOMERS,
        payload: managementEmployeeService.detail(data.id)
      });
    };
  }
};

