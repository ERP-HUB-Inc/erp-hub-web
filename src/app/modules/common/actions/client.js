  
import Constant from "../constants/client";
import ClientService from "../services/ClientService";

export default {
  findClientByColumn: (column, value) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CLIENT,
        payload: ClientService.findClientByColumn({column, value})
      });
    };
  },
  startRegister: (data, step) => {
    return dispatch => {
      return dispatch({
        type: Constant.REGISTER_CLIENT_STEP,
        step,
        payload: data
      });
    };
  },
  register: (data, step) => {
    return dispatch => {
      return dispatch({
        type: Constant.REGISTER_CLIENT,
        step,
        payload: ClientService.register(data)
      });
    };
  },
  signin: (userName, password, storeName) => {
    return dispatch => {
      return dispatch({
        type: Constant.CLIENT_SIGNIN,
        payload: ClientService.signin(userName, password, storeName)
      });
    };
  },
  signinDomain: (domain) => {
    return dispatch => {
      return dispatch({
        type: Constant.DOMAIN_SIGNIN,
        payload: ClientService.domainSignin(domain)
      });
    };
  },
  resetSignInDomain: () => {
    return dispatch => {
      return dispatch({
        type: Constant.DOMAIN_SIGNIN_RESET
      });
    };
  },
  resetRequest: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CLIENT_RESET
      });
    };
  },
  reset: (CONSTANT_RESET = Constant.CLIENT_SIGNIN_RESET) => {
    return dispatch => {
      return dispatch({
        type: CONSTANT_RESET
      });
    };
  }
};
