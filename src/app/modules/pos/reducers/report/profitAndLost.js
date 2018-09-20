import {combineReducers} from "redux";
import Constant from "../../constants/report/profitAndLost";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PROFIT_AND_LOST_REPORT_PENDING,
      Constant.REQUEST_PROFIT_AND_LOST_REPORT_REJECTED,
      Constant.REQUEST_PROFIT_AND_LOST_REPORT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_PROFIT_AND_LOST_REPORT_PENDING,
      Constant.ARCHIVE_PROFIT_AND_LOST_REPORT_REJECTED,
      Constant.ARCHIVE_PROFIT_AND_LOST_REPORT_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_PROFIT_AND_LOST_REPORT_PENDING,
      Constant.ADD_PROFIT_AND_LOST_REPORT_REJECTED,
      Constant.ADD_PROFIT_AND_LOST_REPORT_FULFILLED,
      Constant.SHOW_PROFIT_AND_LOST_REPORT_FORM,
      Constant.RESET_PROFIT_AND_LOST_REPORT
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_PROFIT_AND_LOST_REPORT_PENDING,
      Constant.UPDATE_PROFIT_AND_LOST_REPORT_REJECTED,
      Constant.UPDATE_PROFIT_AND_LOST_REPORT_FULFILLED,
      Constant.SHOW_PROFIT_AND_LOST_REPORT_FORM,
      Constant.RESET_PROFIT_AND_LOST_REPORT
    ];
    return reducer.update(state, action, constants);
  }
});
      