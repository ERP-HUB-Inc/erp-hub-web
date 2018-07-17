import {
  REQUEST_TAX_PENDING,
  REQUEST_TAX_REJECTED,
  REQUEST_TAX_FULFILLED
} from "../constants/settings/tax";
import initialState from "../../common/reducers/initialState";
  
const paymentMethod = (state = initialState("tax"), action) => {
  switch(action.type) {

  case REQUEST_TAX_PENDING: {
    return {
      ...state,
      fetching: true
    };
  }
  case REQUEST_TAX_REJECTED: {
    return {
      ...state,
      fetching: false,
      error: action.payload.data
    };
  }

  case REQUEST_TAX_FULFILLED: {
    return {
      ...state, 
      fetching: false,
      fetched: false,
      tax: action.payload.data
    };
  }

  default:
    return state;
  }
};
  
export default paymentMethod;
  