import {combineReducers} from "redux";
import Constant from "../constants/email";

export default combineReducers({
  send: (state = {sending: false, sent: false, response: null, error: null}, action) => {
    switch(action.type) {
    case Constant.SEND_MAIL_PENDING: {
      return {
        ...state,
        sending: true
      };
    }
    case Constant.SEND_MAIL_REJECTED: {
      return {
        ...state,
        sending: false,
        error: action.payload.response
      };
    }
    case Constant.SEND_MAIL_FULFILLED: {
      return {
        ...state,
        sending: false,
        sent: true,
        response: action.payload.data
      };
    }
    case Constant.SEND_MAIL_RESET: {
      return {
        ...state,
        sending: false,
        sent: false,
        response: null
      };
    }
    default: 
      return state;
    }
  }
});
