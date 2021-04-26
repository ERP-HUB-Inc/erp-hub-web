import ConstantAuth from "../constants/authentication";
import AuthService from "../services/AuthService";

export default {
  checkAuthentication: (accessToken) => {
    return dispatch => {
      return dispatch({
        type: ConstantAuth.CHECK_AUTHENTICATION,
        payload: AuthService.checkAuthenticated(accessToken)
      });
    };
  }
};