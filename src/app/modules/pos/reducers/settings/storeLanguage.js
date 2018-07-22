import {
  REQUEST_STORE_LANGUAGE_PENDING,
  REQUEST_STORE_LANGUAGE_REJECTED,
  REQUEST_STORE_LANGUAGE_FULFILLED,
  ARCHIVE_STORE_LANGUAGE_PENDING,
  ARCHIVE_STORE_LANGUAGE_REJECTED,
  ARCHIVE_STORE_LANGUAGE_FULFILLED,
  ADD_STORE_LANGUAGE_PENDING,
  ADD_STORE_LANGUAGE_REJECTED,
  ADD_STORE_LANGUAGE_FULFILLED
} from "../../constants/settings/storeLanguage";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";
      
export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      REQUEST_STORE_LANGUAGE_PENDING,
      REQUEST_STORE_LANGUAGE_REJECTED,
      REQUEST_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      ARCHIVE_STORE_LANGUAGE_PENDING,
      ARCHIVE_STORE_LANGUAGE_REJECTED,
      ARCHIVE_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      ADD_STORE_LANGUAGE_PENDING,
      ADD_STORE_LANGUAGE_REJECTED,
      ADD_STORE_LANGUAGE_FULFILLED
    ];
    return reducer.add(state, action, constants);
  }
};
      