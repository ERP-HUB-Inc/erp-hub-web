  
import Constant from "../constants/authentication";

export default {
  sendMailReset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.SEND_MAIL_RESET,
        payload: null
      });
    };
  }
};