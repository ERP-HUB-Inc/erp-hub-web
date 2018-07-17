import {
  REQUEST_PAYMENT_METHOD_PENDING,
  REQUEST_PAYMENT_METHOD_REJECTED,
  REQUEST_PAYMENT_METHOD_FULFILLED,
  ARCHIVE_PAYMENT_METHOD_PENDING,
  ARCHIVE_PAYMENT_METHOD_REJECTED,
  ARCHIVE_PAYMENT_METHOD_FULFILLED
} from "../../constants/settings/paymentMethod";
import InitialState from "../../../common/reducers/initialState";

export default {
  request: (state = InitialState.request("paymentMethods"), action) => {
    switch(action.type) {
    case REQUEST_PAYMENT_METHOD_PENDING: {
      return {
        ...state,
        fetching: true
      };
    }
    case REQUEST_PAYMENT_METHOD_REJECTED: {
      return {
        ...state,
        fetching: false,
        error: action.payload.data
      };
    }
    case REQUEST_PAYMENT_METHOD_FULFILLED: {
      return {
        ...state, 
        fetching: false,
        fetched: true,
        paymentMethods: action.payload.data
      };
    }
    default:
      return state;
    }
  },
  archive: (state = InitialState.archive("success"), action) => {
    switch(action.type) {
    case ARCHIVE_PAYMENT_METHOD_PENDING: {
      return {
        ...state,
        archiving: true
      };
    }
    case ARCHIVE_PAYMENT_METHOD_REJECTED: {
      return {
        ...state,
        archiving: false,
        error: action.payload.data
      };
    }
    case ARCHIVE_PAYMENT_METHOD_FULFILLED: {
      return {
        ...state, 
        archiving: false,
        archived: true,
        success: action.payload.data
      };
    }
    default:
      return state;
    }
  }
};
