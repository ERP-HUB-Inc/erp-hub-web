import {combineReducers} from "redux";
import reducer from "../../../common/reducers/reducer";
import Constant from "../../constants/transactions/transaction";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_TRANSACTION_PENDING,
      Constant.REQUEST_TRANSACTION_REJECTED,
      Constant.REQUEST_TRANSACTION_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  todaySaleSummary: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_TODAY_SALE_SUMMARY_PENDING,
      Constant.REQUEST_TODAY_SALE_SUMMARY_REJECTED,
      Constant.REQUEST_TODAY_SALE_SUMMARY_FULFILLED,
      Constant.RESET_TRANSACTION
    ];
    return reducer.request(state, action, constants);
  },
  detail: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.DETAIL_TRANSACTION_PENDING,
      Constant.DETAIL_TRANSACTION_REJECTED,
      Constant.DETAIL_TRANSACTION_FULFILLED,
      Constant.RESET_DETAIL_TRANSACTION,
      Constant.PARTIAL_RESET_DETAIL_TRANSACTION
    ];
    return reducer.detail(state, action, constants);
  },
  posPay: (state = {showForm: false, paying: false, paid: false, response: null, error: null}, action) => {
    switch(action.type) {
    case Constant.SHOW_PAYMENT_FORM: {
      return {
        ...state,
        showForm: true
      };
    }
    case Constant.ADD_TRANSACTION_PENDING: {
      return {
        ...state,
        paying: true
      };
    }
    case Constant.ADD_TRANSACTION_REJECTED: {
      return {
        ...state,
        paying: false,
        error: action.payload.response
      };
    }
    case Constant.ADD_TRANSACTION_FULFILLED: {
      return {
        ...state,
        paying: false,
        paid: true,
        response: action.payload.data
      };
    }
    case Constant.RESET_TRANSACTION: {
      return {
        showForm: false,
        paying: false,
        paid: false,
        error: null,
        response: null
      };
    }
    default: 
      return state;
    }
  }
});
