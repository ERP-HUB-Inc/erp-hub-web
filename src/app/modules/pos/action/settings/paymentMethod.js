import {
  REQUEST_PAYMENT_METHOD
} from "../../constants/settings/paymentMethod";
import PaymentMethodService from "../../services/settings/PaymentMethodService";

export function fetchPaymentMethods() {
  return dispatch => {
    return dispatch({
      type: REQUEST_PAYMENT_METHOD,
      payload: PaymentMethodService.lists()
    });
  };
}
