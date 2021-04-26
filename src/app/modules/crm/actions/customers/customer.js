import Constant from "../../constants/customers/customer";
import CustomerService from "../../services/customers/CustomerService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CUSTOMERS,
        payload: CustomerService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_CUSTOMERS,
        payload: CustomerService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_CUSTOMERS,
        payload: CustomerService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_CUSTOMERS,
        payload: CustomerService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT=Constant.RESET_CUSTOMERS) => {
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
        type: Constant.SHOW_CUSTOMERS_FORM,
        payload: null
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_CUSTOMERS,
        payload: CustomerService.detail(data.id)
      });
    };
  }
};

