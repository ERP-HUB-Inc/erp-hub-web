import {
  REQUEST_CURRENCY_PENDING,
  REQUEST_CURRENCY_REJECTED,
  REQUEST_CURRENCY_FULFILLED
} from "../../constants/settings/currency";
import InitialState from "../../../common/reducers/initialState";
    
const currencyMethod = (state = InitialState.request("currency"), action) => {
  switch(action.type) {
  
  case REQUEST_CURRENCY_PENDING: {
    return {
      ...state,
      fetching: true
    };
  }
  case REQUEST_CURRENCY_REJECTED: {
    return {
      ...state,
      fetching: false,
      error: action.payload.data
    };
  }
  
  case REQUEST_CURRENCY_FULFILLED: {
    return {
      ...state, 
      fetching: false,
      fetched: false,
      currency: action.payload.data
    };
  }
  
  default:
    return state;
  }
};
    
export default currencyMethod;
    