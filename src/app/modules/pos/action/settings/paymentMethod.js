import {
  REQUEST_PAYMENT_METHOD,
  ARCHIVE_PAYMENT_METHOD,
  ADD_PAYMENT_METHOD
} from "../../constants/settings/paymentMethod";
import PaymentMethodService from "../../services/settings/PaymentMethodService";

export default {
  fetchPaymentMethods: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: REQUEST_PAYMENT_METHOD,
        payload: PaymentMethodService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archivePaymentMethods: (ids) => {
    return dispatch => {
      return dispatch({
        type: ARCHIVE_PAYMENT_METHOD,
        payload: PaymentMethodService.archive(ids)
      });
    };
  },
  addPaymentMethods: (data) => {
    return dispatch => {
      return dispatch({
        type: ADD_PAYMENT_METHOD,
        payload: PaymentMethodService.add(data)
      });
    };
  }
};

