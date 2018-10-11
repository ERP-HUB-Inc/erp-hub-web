import Constant from "../../constants/transactions/transaction";
import TransactionService from "../../services/transactions/TransactionService";

export default {
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_TRANSACTION,
        payload: TransactionService.add(data)
      });
    };
  },
  sendEmailReceipt: (template, email) => {
    return dispatch => {
      return dispatch({
        type: Constant.SEND_MAIL_RECEIPT_TRANSACTION,
        payload: TransactionService.sendMailReceipt(template, email)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_TRANSACTION,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PAYMENT_FORM,
        payload: data
      });
    };
  }
};
