  
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
  }
};
