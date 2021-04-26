import Constant from "../../constants/settings/paymentMethod";
import PaymentMethodService from "../../services/settings/PaymentMethodService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PAYMENT_METHOD,
        payload: PaymentMethodService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PAYMENT_METHOD,
        payload: PaymentMethodService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PAYMENT_METHOD,
        payload: PaymentMethodService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PAYMENT_METHOD,
        payload: PaymentMethodService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD) => {
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
        type: Constant.SHOW_PAYMENT_METHOD_FORM,
        payload: data
      });
    };
  }
};

