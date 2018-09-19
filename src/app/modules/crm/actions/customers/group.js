import Constant from "../../constants/customers/groupCustomer";
import managementEmployeeService from "../../services/groupCustomers/groupCustomers";

export default {

  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_MANAGEMENT_GROUP_CUSTOMERS,
        payload: managementEmployeeService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_MANAGEMENT_GROUP_CUSTOMERS_FORM,
        payload: data
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_MANAGEMENT_GROUP_CUSTOMERS,
        payload: managementEmployeeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_MANAGEMENT_GROUP_CUSTOMERS,
        payload: managementEmployeeService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS,
        payload: null
      });
    };
  },
};

