import Constant from "../../constants/transactions/transaction";
import ConstantEmail from "../../../common/constants/email";
import TransactionService from "../../services/transactions/TransactionService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_TRANSACTION,
        payload: TransactionService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  todaySaleSummary: (lastOpenSaleRegisterDate) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_TODAY_SALE_SUMMARY,
        payload: TransactionService.todaySaleSummary(lastOpenSaleRegisterDate)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_TRANSACTION,
        payload: TransactionService.add(data)
      });
    };
  },
  detail: (data, languageId) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_TRANSACTION,
        payload: TransactionService.detail(data.id, languageId)
      });
    };
  },
  sendEmailReceipt: (template, email) => {
    return dispatch => {
      return dispatch({
        type: ConstantEmail.SEND_MAIL,
        payload: TransactionService.sendMailReceipt(template, email)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_TRANSACTION) => {
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
        type: Constant.SHOW_PAYMENT_FORM,
        payload: data
      });
    };
  },
  returnTransaction: (referenceId, data) => {
    return dispatch => {
      return dispatch({
        type: Constant.RETURN_TRANSACTION,
        payload: TransactionService.returnTransaction(referenceId, data)
      });
    };
  }

};
