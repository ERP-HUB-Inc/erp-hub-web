import {combineReducers} from "redux";
import Constant from "../../constants/settings/storeLocation";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_LOCATION_PENDING,
      Constant.REQUEST_LOCATION_REJECTED,
      Constant.REQUEST_LOCATION_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  requestAccessLocation: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_LOCATION_ACCESS_PENDING,
      Constant.REQUEST_LOCATION_ACCESS_REJECTED,
      Constant.REQUEST_LOCATION_ACCESS_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_LOCATION_PENDING,
      Constant.ARCHIVE_LOCATION_REJECTED,
      Constant.ARCHIVE_LOCATION_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_LOCATION_PENDING,
      Constant.ADD_LOCATION_REJECTED,
      Constant.ADD_LOCATION_FULFILLED,
      Constant.SHOW_STORE_LOCATION_FORM,
      Constant.RESET_STORE_LOCATION
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_LOCATION_PENDING,
      Constant.UPDATE_LOCATION_REJECTED,
      Constant.UPDATE_LOCATION_FULFILLED,
      Constant.SHOW_STORE_LOCATION_FORM,
      Constant.RESET_STORE_LOCATION
    ];
    return reducer.update(state, action, constants);
  }
});
      