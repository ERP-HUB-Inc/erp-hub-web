import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/client";
import InitialState from "./initialState";
    
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CLIENT_PENDING,
      Constant.REQUEST_CLIENT_REJECTED,
      Constant.REQUEST_CLIENT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  register: (state = {step: 1, submiting: false, submited: false, response: null }, action) => {
    switch(action.type) {
    case Constant.REGISTER_CLIENT_STEP: {
      return {
        ...state,
        step: action.step,
        response: action.payload
      };
    }
    case Constant.REGISTER_CLIENT_PENDING: {
      return {
        ...state,
        submiting: true
      };
    }
    case Constant.REGISTER_CLIENT_REJECTED: {
      return {
        ...state,
        submiting: false,
        error: action.payload.response.data
      };
    }
    case Constant.REGISTER_CLIENT_FULFILLED: {
      return {
        ...state,
        step: 3,
        submiting: false,
        submited: true,
        response: action.payload.data
      };
    }
    case Constant.RESET_REGISTER_CLIENT: {
      return {
        submiting: false,
        submited: false,
        response: null
      };
    }
    default: 
      return state;
    }
  }
});
    