import {combineReducers} from "redux";
import Constant from "../../constants/report/inventory";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_INVENTORY_REPORT_PENDING,
      Constant.REQUEST_INVENTORY_REPORT_REJECTED,
      Constant.REQUEST_INVENTORY_REPORT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_INVENTORY_REPORT_PENDING,
      Constant.ARCHIVE_INVENTORY_REPORT_REJECTED,
      Constant.ARCHIVE_INVENTORY_REPORT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_INVENTORY_REPORT_PENDING,
      Constant.ADD_INVENTORY_REPORT_REJECTED,
      Constant.ADD_INVENTORY_REPORT_FULFILLED,
      Constant.SHOW_INVENTORY_REPORT_FORM,
      Constant.RESET_INVENTORY_REPORT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_INVENTORY_REPORT_PENDING,
      Constant.UPDATE_INVENTORY_REPORT_REJECTED,
      Constant.UPDATE_INVENTORY_REPORT_FULFILLED,
      Constant.SHOW_INVENTORY_REPORT_FORM,
      Constant.RESET_INVENTORY_REPORT
    ];
    return reducer.update(state, action, constants);
  }
});
      