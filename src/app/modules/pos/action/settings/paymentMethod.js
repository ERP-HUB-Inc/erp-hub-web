import {
  REQUEST_PAYMENT_METHOD,
  ARCHIVE_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD,
  RESET_PAYMENT_METHOD
} from "../../constants/settings/paymentMethod";
import PaymentMethodService from "../../services/settings/PaymentMethodService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: REQUEST_PAYMENT_METHOD,
        payload: PaymentMethodService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: ARCHIVE_PAYMENT_METHOD,
        payload: PaymentMethodService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: ADD_PAYMENT_METHOD,
        payload: PaymentMethodService.add(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: RESET_PAYMENT_METHOD,
        payload: null
      });
    };
  }
};

