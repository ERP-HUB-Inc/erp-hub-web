  
import Constant from "../../constants/settings/device";
import DeviceService from "../../services/settings/DeviceService";

export default {
  fetch: (limit, offset) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_DEVICE,
        payload: DeviceService.lists(limit, offset)
      });
    };
  },
  update: (number, storeName) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_DEVICE,
        payload: DeviceService.update(number, storeName)
      });
    };
  },
  reset: (CONSTANT_RESET = Constant.RESET_UPDATE) => {
    return dispatch => {
      return dispatch({
        type: CONSTANT_RESET,
        payload: null
      });
    };
  }
};
