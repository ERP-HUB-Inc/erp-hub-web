import Constant from "../../constants/settings/incomeAndExpense";
import IncomeExpense from "../../services/settings/IncomeExpense";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_INCOME_EXPENSE,
        payload: IncomeExpense.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_INCOME_EXPENSE,
        payload: IncomeExpense.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_INCOME_EXPENSE,
        payload: IncomeExpense.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_INCOME_EXPENSE,
        payload: IncomeExpense.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_INCOME_EXPENSE,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_INCOME_EXPENSE_FORM,
        payload: data
      });
    };
  }
};

