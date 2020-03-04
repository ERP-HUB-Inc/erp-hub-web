import {combineReducers} from "redux";
import Constant from "../../constants/settings/device";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_DEVICE_PENDING,
      Constant.REQUEST_DEVICE_REJECTED,
      Constant.REQUEST_DEVICE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  checkDevice: (state = InitialState.detail(), action) => {
    const constants = [
      Constant.CHECK_DEVICE_PENDING,
      Constant.CHECK_DEVICE_REJECTED,
      Constant.CHECK_DEVICE_FULFILLED,
      null,
      Constant.RESET_CHECK_DEVICE
    ];
    return reducer.detail(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_DEVICE_PENDING,
      Constant.UPDATE_DEVICE_REJECTED,
      Constant.UPDATE_DEVICE_FULFILLED,
      null,
      Constant.RESET_UPDATE
    ];
    return reducer.update(state, action, constants);
  },
  renew: (state = InitialState.update(), action) => {
    const constants = [
      Constant.RENEW_DEVICE_PENDING,
      Constant.RENEW_DEVICE_REJECTED,
      Constant.RENEW_DEVICE_FULFILLED,
      null,
      Constant.RESET_RENEW_DEVICE
    ];
    return reducer.update(state, action, constants);
  }
});
    