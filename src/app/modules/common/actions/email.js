import Constant from "../constants/email";
import EmailService from "../services/EmailService";

export default {
  send: (content, email, subject) => {
    return dispatch => {
      return dispatch({
        type: Constant.SEND_MAIL,
        payload: EmailService.send(content, email, subject)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.SEND_MAIL_RESET,
        payload: null
      });
    };
  },
};