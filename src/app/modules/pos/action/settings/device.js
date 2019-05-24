  
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
  update: (deviceName, number, storeName) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_DEVICE,
        payload: DeviceService.update(deviceName, number, storeName)
      });
    };
  },
  renew: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.RENEW_DEVICE,
        payload: DeviceService.renew(id)
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
