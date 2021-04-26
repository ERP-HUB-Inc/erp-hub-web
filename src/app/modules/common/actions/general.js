  
import Constant from "../constants/email";

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