import {combineReducers} from "redux";
import Constant from "../../constants/transactions/transaction";

export default combineReducers({
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
        adding: false,
        showForm: false,
        added: false,
        response: null
      };
    }
    default: 
      return state;
    }
  }
});
