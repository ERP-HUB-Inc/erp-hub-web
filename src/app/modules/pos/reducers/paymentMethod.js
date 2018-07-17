import {
  REQUEST_PAYMENT_METHOD_PENDING,
  REQUEST_PAYMENT_METHOD_REJECTED,
  REQUEST_PAYMENT_METHOD_FULFILLED
} from "../constants/settings/paymentMethod";
import initialState from "../../common/reducers/initialState";

const paymentMethod = (state = initialState("paymentMethods"), action) => {
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
};

export default paymentMethod;
