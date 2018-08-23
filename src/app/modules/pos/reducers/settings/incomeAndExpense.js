import {combineReducers} from "redux";
import Constant from "../../constants/settings/incomeAndExpense";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_INCOME_EXPENSE_PENDING,
      Constant.REQUEST_INCOME_EXPENSE_REJECTED,
      Constant.REQUEST_INCOME_EXPENSE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_INCOME_EXPENSE_PENDING,
      Constant.ARCHIVE_INCOME_EXPENSE_REJECTED,
      Constant.ARCHIVE_INCOME_EXPENSE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_INCOME_EXPENSE_PENDING,
      Constant.ADD_INCOME_EXPENSE_REJECTED,
      Constant.ADD_INCOME_EXPENSE_FULFILLED,
      Constant.SHOW_INCOME_EXPENSE_FORM,
      Constant.RESET_INCOME_EXPENSE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_INCOME_EXPENSE_PENDING,
      Constant.UPDATE_INCOME_EXPENSE_REJECTED,
      Constant.UPDATE_INCOME_EXPENSE_FULFILLED,
      Constant.SHOW_INCOME_EXPENSE_FORM,
      Constant.RESET_INCOME_EXPENSE
    ];
    return reducer.update(state, action, constants);
  }
});
