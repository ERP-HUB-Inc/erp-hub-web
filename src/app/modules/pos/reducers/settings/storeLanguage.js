import {
  REQUEST_STORE_LANGUAGE_PENDING,
  REQUEST_STORE_LANGUAGE_REJECTED,
  REQUEST_STORE_LANGUAGE_FULFILLED
} from "../../constants/settings/storeLanguage";
import InitialState from "../../../common/reducers/initialState";
      
const storeLocation = (state = InitialState.request("storeLanguage"), action) => {
  switch(action.type) {
    
  case  REQUEST_STORE_LANGUAGE_PENDING: {
    return {
      ...state,
      fetching: true
    };
  }
  case REQUEST_STORE_LANGUAGE_REJECTED: {
    return {
      ...state,
      fetching: false,
      error: action.payload.data
    };
  }
    
  case REQUEST_STORE_LANGUAGE_FULFILLED: {
    return {
      ...state, 
      fetching: false,
      fetched: false,
      storeLanguage: action.payload.data
    };
  }
    
  default:
    return state;
  }
};
      
export default storeLocation;
      