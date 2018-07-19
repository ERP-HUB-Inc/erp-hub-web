import {
  REQUEST_STORE_LOCATION_PENDING,
  REQUEST_STORE_LOCATION_REJECTED,
  REQUEST_STORE_LOCATION_FULFILLED
} from "../../constants/settings/storeLocation";
import InitialState from "../../../common/reducers/initialState";
      
const storeLocation = (state = InitialState.request("storeLocation"), action) => {
  switch(action.type) {
    
  case  REQUEST_STORE_LOCATION_PENDING: {
    return {
      ...state,
      fetching: true
    };
  }
  case REQUEST_STORE_LOCATION_REJECTED: {
    return {
      ...state,
      fetching: false,
      error: action.payload.data
    };
  }
    
  case REQUEST_STORE_LOCATION_FULFILLED: {
    return {
      ...state, 
      fetching: false,
      fetched: false,
      storeLocation: action.payload.data
    };
  }
    
  default:
    return state;
  }
};
      
export default storeLocation;
      