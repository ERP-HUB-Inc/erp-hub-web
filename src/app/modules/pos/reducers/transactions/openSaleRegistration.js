import {combineReducers} from "redux";
import Constant from "../../constants/transactions/openSaleRegisration";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_OPEN_SALE_REGISTRATION_PENDING,
      Constant.REQUEST_OPEN_SALE_REGISTRATION_REJECTED,
      Constant.REQUEST_OPEN_SALE_REGISTRATION_FULFILLED,
      Constant.RESET_REQUEST_OPEN_SALE_REGISTRATION
    ];
    return reducer.request(state, action, constants);
  },
  open: (state = InitialState.add(), action) => {
    const constants = [
      Constant.OPEN_SALE_REGISTRATION_PENDING,
      Constant.OPEN_SALE_REGISTRATION_REJECTED,
      Constant.OPEN_SALE_REGISTRATION_FULFILLED,
      Constant.SHOW_OPEN_SALE_REGISTRATION_FORM,
      Constant.RESET_OPEN_SALE_REGISTRATION
    ];
    return reducer.add(state, action, constants);
  },
  close: (state = InitialState.update(), action) => {
    const constants = [
      Constant.CLOSE_SALE_REGISTRATION_PENDING,
      Constant.CLOSE_SALE_REGISTRATION_REJECTED,
      Constant.CLOSE_SALE_REGISTRATION_FULFILLED,
      null,
      Constant.RESET_OPEN_SALE_REGISTRATION
    ];
    return reducer.update(state, action, constants);
  }
});
    