import reducer from "../reducer";
import { combineReducers } from "redux";
import Constant from "../../constants/customers/groupCustomer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_MANAGEMENT_GROUP_CUSTOMERS_PENDING,
      Constant.REQUEST_MANAGEMENT_GROUP_CUSTOMERS_REJECTED,
      Constant.REQUEST_MANAGEMENT_GROUP_CUSTOMERS_FULFILLED,
      Constant.SHOW_MANAGEMENT_GROUP_CUSTOMERS_FORM, 
    ];
    return reducer.request(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_MANAGEMENT_GROUP_CUSTOMERS_PENDING, 
      Constant.ADD_MANAGEMENT_GROUP_CUSTOMERS_REJECTED,
      Constant.ADD_MANAGEMENT_GROUP_CUSTOMERS_FULFILLED,
      Constant.SHOW_MANAGEMENT_GROUP_CUSTOMERS_FORM,
      Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS
    ];
    return reducer.add(state, action, constants);
  },

});
