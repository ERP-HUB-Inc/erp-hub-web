import {combineReducers} from "redux";
import Constant from "../../constants/report/sale";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_SALE_REPORT_PENDING,
      Constant.REQUEST_SALE_REPORT_REJECTED,
      Constant.REQUEST_SALE_REPORT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
      