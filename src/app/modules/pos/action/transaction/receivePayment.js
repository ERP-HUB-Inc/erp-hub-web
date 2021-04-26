import Constant from "../../constants/transactions/receivePayment";
import ReceivePaymentService from "../../services/transactions/TransactionService";

export default {
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RECEIVE_PAYMENT,
        payload: ReceivePaymentService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_RECEIVE_PAYMENT) => {
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
        type: Constant.SHOW_RECEIVE_PAYMENT_FORM,
        payload: data
      });
    };
  }
};
