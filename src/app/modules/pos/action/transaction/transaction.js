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
