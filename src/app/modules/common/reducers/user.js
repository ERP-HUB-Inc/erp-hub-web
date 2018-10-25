import {combineReducers} from "redux";
import Constant from "../constants/users";
import reducer from "../reducers/reducer";
import InitialState from "../reducers/initialState";

export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_USERS_PENDING,
      Constant.REQUEST_USERS_REJECTED,
      Constant.REQUEST_USERS_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }
});
