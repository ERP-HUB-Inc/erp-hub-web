import Constant from "../../constants/transactions/openSaleRegisration";
import OpenSaleRegistrationService from "../../services/transactions/OpenSaleRegistrationService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_OPEN_SALE_REGISTRATION,
        payload: OpenSaleRegistrationService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  last: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_OPEN_SALE_REGISTRATION,
        payload: OpenSaleRegistrationService.last()
      });
    };
  },
  open: (open, description) => {
    return dispatch => {
      return dispatch({
        type: Constant.OPEN_SALE_REGISTRATION,
        payload: OpenSaleRegistrationService.open(open, description)
      });
    };
  },
  close: (id, data) => {
    return dispatch => {
      return dispatch({
        type: Constant.CLOSE_SALE_REGISTRATION,
        payload: OpenSaleRegistrationService.close(id, data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_REQUEST_OPEN_SALE_REGISTRATION) => {
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
        type: Constant.SHOW_OPEN_SALE_REGISTRATION_FORM,
        payload: null
      });
    };
  }
};
