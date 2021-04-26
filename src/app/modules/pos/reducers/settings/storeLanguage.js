import {combineReducers} from "redux";
import Constant from "../../constants/settings/storeLanguage";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";
      
export default combineReducers({
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_LANGUAGE_PENDING,
      Constant.REQUEST_LANGUAGE_REJECTED,
      Constant.REQUEST_LANGUAGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_LANGUAGE_PENDING,
      Constant.ARCHIVE_LANGUAGE_REJECTED,
      Constant.ARCHIVE_LANGUAGE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_LANGUAGE_PENDING,
      Constant.ADD_LANGUAGE_REJECTED,
      Constant.ADD_LANGUAGE_FULFILLED,
      Constant.SHOW_LANGUAGE_FORM,
      Constant.RESET_LANGUAGE,
      Constant.RESET_LANGUAGE_ADD
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.UPDATE_LANGUAGE_PENDING,
      Constant.UPDATE_LANGUAGE_REJECTED,
      Constant.UPDATE_LANGUAGE_FULFILLED,
      Constant.SHOW_LANGUAGE_FORM,
      Constant.RESET_LANGUAGE
    ];
    return reducer.update(state, action, constants);
  }
});
      