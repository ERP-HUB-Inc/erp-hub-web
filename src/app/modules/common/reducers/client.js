import reducer from "./reducer";
import {combineReducers} from "redux";
import Constant from "../constants/client";
import ConstantAuth from "../constants/authentication";
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
  checkExist: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CLIENT_PENDING,
      Constant.REQUEST_CLIENT_REJECTED,
      Constant.REQUEST_CLIENT_FULFILLED,
      Constant.REQUEST_CLIENT_RESET
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
        ...state,
        submited: false
      };
    }
    default: 
      return state;
    }
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.REGISTER_CLIENT_PENDING,
      Constant.REGISTER_CLIENT_REJECTED,
      Constant.REGISTER_CLIENT_FULFILLED,
      null,
      Constant.RESET_REGISTER_CLIENT
    ];
    return reducer.add(state, action, constants);
  },
  signin: (state = {submiting: false, submited: false, error: null, response: null}, action) => {
    switch(action.type) {
    case Constant.CLIENT_SIGNIN_PENDING: {
      return {
        ...state,
        submiting: true
      };
    }
    case Constant.CLIENT_SIGNIN_REJECTED: {
      return {
        ...state,
        submiting: false,
        error: action.payload
      };
    }
    case Constant.CLIENT_SIGNIN_FULFILLED: {
      return {
        ...state, 
        submiting: false,
        submited: true,
        response: action.payload
      };
    }
    case Constant.CLIENT_SIGNIN_RESET: {
      return {
        ...state,
        submiting: false,
        submited: false,
        error: null,
        response: null
      };
    }
    default:
      return state;
    }
  },
  signinDomain: (state = {submiting: false, submited: false, error: null, response: null}, action) => {
    switch(action.type) {
    case Constant.DOMAIN_SIGNIN_PENDING: {
      return {
        ...state,
        submiting: true
      };
    }
    case Constant.DOMAIN_SIGNIN_REJECTED: {
      return {
        ...state,
        submiting: false,
        error: action.payload
      };
    }
    case Constant.DOMAIN_SIGNIN_FULFILLED: {
      return {
        ...state, 
        submiting: false,
        submited: true,
        response: action.payload
      };
    }
    case Constant.DOMAIN_SIGNIN_RESET: {
      return {
        ...state,
        submiting: false,
        submited: false,
        error: null,
        response: null
      };
    }
    default:
      return state;
    }
  },
  checkAuthentication: (state = {checking: false, checked: false, error: null, response: null}, action) => {
    switch(action.type) {
    case ConstantAuth.CHECK_AUTHENTICATION_PENDING: {
      return {
        ...state,
        checking: true
      };
    }
    case ConstantAuth.CHECK_AUTHENTICATION_REJECTED: {
      return {
        ...state,
        checking: false,
        error: action.payload
      };
    }
    case ConstantAuth.CHECK_AUTHENTICATION_FULFILLED: {
      return {
        ...state, 
        checking: false,
        checked: true,
        response: action.payload
      };
    }
    default:
      return state;
    }
  }
});
    