import Constant from "../../constants/transactions/incomeExpenseCategory";
import Service from "../../services/transactions/IncomeExpenseCategoryService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_INCOME_EXPENSE_CATEGORY,
        payload: Service.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_INCOME_EXPENSE_CATEGORY,
        payload: Service.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_INCOME_EXPENSE_CATEGORY,
        payload: Service.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_INCOME_EXPENSE_CATEGORY,
        payload: Service.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_INCOME_EXPENSE_CATEGORY,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_INCOME_EXPENSE_CATEGORY_FORM,
        payload: data
      });
    };
  }
};

