import {combineReducers} from "redux";
import Constant from "../../constants/settings/currencyExchange";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CURRENCY_EXCHANGE_PENDING,
      Constant.REQUEST_CURRENCY_EXCHANGE_REJECTED,
      Constant.REQUEST_CURRENCY_EXCHANGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CURRENCY_EXCHANGE_PENDING,
      Constant.ARCHIVE_CURRENCY_EXCHANGE_REJECTED,
      Constant.ARCHIVE_CURRENCY_EXCHANGE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CURRENCY_EXCHANGE_PENDING,
      Constant.ADD_CURRENCY_EXCHANGE_REJECTED,
      Constant.ADD_CURRENCY_EXCHANGE_FULFILLED,
      Constant.SHOW_CURRENCY_EXCHANGE_FORM,
      Constant.RESET_CURRENCY_EXCHANGE
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_CURRENCY_EXCHANGE_PENDING,
      Constant.UPDATE_CURRENCY_EXCHANGE_REJECTED,
      Constant.UPDATE_CURRENCY_EXCHANGE_FULFILLED,
      Constant.SHOW_CURRENCY_EXCHANGE_FORM,
      Constant.RESET_CURRENCY_EXCHANGE
    ];
    return reducer.update(state, action, constants);
  }
});
    