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
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_DEVICE_PENDING,
      Constant.UPDATE_DEVICE_REJECTED,
      Constant.UPDATE_DEVICE_FULFILLED,
      null,
      Constant.RESET_UPDATE
    ];
    return reducer.update(state, action, constants);
  }
});
    