import {
  REQUEST_TAX_PENDING,
  REQUEST_TAX_REJECTED,
  REQUEST_TAX_FULFILLED,
  ARCHIVE_TAX_PENDING,
  ARCHIVE_TAX_REJECTED,
  ARCHIVE_TAX_FULFILLED,
  ADD_TAX_PENDING,
  ADD_TAX_REJECTED,
  ADD_TAX_FULFILLED
} from "../../constants/settings/tax";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";
  
export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      REQUEST_TAX_PENDING,
      REQUEST_TAX_REJECTED,
      REQUEST_TAX_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      ARCHIVE_TAX_PENDING,
      ARCHIVE_TAX_REJECTED,
      ARCHIVE_TAX_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      ADD_TAX_PENDING,
      ADD_TAX_REJECTED,
      ADD_TAX_FULFILLED
    ];
    return reducer.add(state, action, constants);
  }
};
  
  