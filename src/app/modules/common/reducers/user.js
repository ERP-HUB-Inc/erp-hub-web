import {
  REQUEST_USERS_PENDING,
  REQUEST_USERS_REJECTED,
  REQUEST_USERS_FULFILLED
} from "../constants/users";
import InitialState from "./initialState";

const user = (state = InitialState.request("users"), action) => {
  switch(action.type) {
	  case REQUEST_USERS_PENDING: {
    return {
      ...state,
      fetching: true
    };
	  }
	  case REQUEST_USERS_REJECTED: {
    return {
      ...state,
      fetching: false,
      error: action.payload.data
    };
	  }
	  case REQUEST_USERS_FULFILLED: {
    return {
      ...state, 
      fetching: false,
      fetched: true,
      users: action.payload.data
    };
  }
  default:
    return state;
  }
};

export default user;
