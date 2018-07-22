import {          
  REQUEST_CURRENCY_PENDING,
  REQUEST_CURRENCY_REJECTED,
  REQUEST_CURRENCY_FULFILLED,
  ARCHIVE_CURRENCY_PENDING,
  ARCHIVE_CURRENCY_REJECTED,
  ARCHIVE_CURRENCY_FULFILLED,
  ADD_CURRENCY_PENDING,
  ADD_CURRENCY_REJECTED,
  ADD_CURRENCY_FULFILLED
} from "../../constants/settings/currency";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";
    
export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      REQUEST_CURRENCY_PENDING,
      REQUEST_CURRENCY_REJECTED,
      REQUEST_CURRENCY_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      ARCHIVE_CURRENCY_PENDING,
      ARCHIVE_CURRENCY_REJECTED,
      ARCHIVE_CURRENCY_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      ADD_CURRENCY_PENDING,
      ADD_CURRENCY_REJECTED,
      ADD_CURRENCY_FULFILLED
    ];
    return reducer.add(state, action, constants);
  }
};
    