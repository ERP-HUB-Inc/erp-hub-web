import {combineReducers} from "redux";
import Constant from "../../constants/settings/privilege";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_PRIVILEGE_PENDING,
      Constant.REQUEST_PRIVILEGE_REJECTED,
      Constant.REQUEST_PRIVILEGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  checkPermission: (state = {checking: false, checked: false, response: null, error: null}, action) => {
    switch(action.type) {
    case Constant.CHECK_PERMISSION_PENDING: {
      return {
        ...state,
        checking: true
      };
    }
    case Constant.CHECK_PERMISSION_REJECTED: {
      return {
        ...state,
        checking: false,
        error: action.payload.response
      };
    }
    case Constant.CHECK_PERMISSION_FULFILLED: {
      return {
        ...state,
        checking: false,
        checked: true,
        response: action.payload.data
      };
    }
    case Constant.RESET_CHECK_PERMISSION: {
      return {
        checking: false,
        checked: false,
        error: null,
        response: null
      };
    }
    default: 
      return state;
    }
  }
});
      