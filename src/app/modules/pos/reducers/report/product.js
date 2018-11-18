import {combineReducers} from "redux";
import Constant from "../../constants/report/product";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRODUCT_REPORT_PENDING,
      Constant.REQUEST_PRODUCT_REPORT_REJECTED,
      Constant.REQUEST_PRODUCT_REPORT_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
      