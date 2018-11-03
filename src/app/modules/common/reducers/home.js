import reducer from "./reducer";
import { combineReducers } from "redux";
import Constant from "../constants/home";
import InitialState from "./initialState";
    
export default combineReducers({
  listGraph: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_GRAPH_PENDING,
      Constant.REQUEST_GRAPH_REJECTED,
      Constant.REQUEST_GRAPH_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },

  listPipe: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PIPE_PENDING,
      Constant.REQUEST_PIPE_REJECTED,
      Constant.REQUEST_PIPE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },

  listCardDashboard: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CARD_DASHBOARD_PENDING,
      Constant.REQUEST_CARD_DASHBOARD_REJECTED,
      Constant.REQUEST_CARD_DASHBOARD_FULFILLED
    ];
    return reducer.request(state, action, constants);
  }


});
    