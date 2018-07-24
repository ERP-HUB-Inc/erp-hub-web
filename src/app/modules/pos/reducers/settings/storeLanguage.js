import reducer from "../reducer";
import Constant from "../../constants/settings/storeLanguage";
import InitialState from "../../../common/reducers/initialState";
      
export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_STORE_LANGUAGE_PENDING,
      Constant.REQUEST_STORE_LANGUAGE_REJECTED,
      Constant.REQUEST_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_STORE_LANGUAGE_PENDING,
      Constant.ARCHIVE_STORE_LANGUAGE_REJECTED,
      Constant.ARCHIVE_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_STORE_LANGUAGE_PENDING,
      Constant.ADD_STORE_LANGUAGE_REJECTED,
      Constant.ADD_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.add(state, action, constants);
  },
  update: (state = InitialState.update(), action) => {
    const constants = [
      Constant.update_STORE_LANGUAGE_PENDING,
      Constant.update_STORE_LANGUAGE_REJECTED,
      Constant.update_STORE_LANGUAGE_FULFILLED,
      Constant.SHOW_STORE_LANGUAGE_FORM,
      Constant.RESET_STORE_LANGUAGE
    ];
    return reducer.update(state, action, constants);
  }
};
      