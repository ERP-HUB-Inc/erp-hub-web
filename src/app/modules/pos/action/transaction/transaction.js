import Constant from "../../constants/transactions/transaction";
import ConstantAuth from "../../../common/constants/authentication";
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
        type: ConstantAuth.SEND_MAIL,
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
