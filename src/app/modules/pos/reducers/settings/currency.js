import reducer from "../reducer";
import Constant from "../../constants/settings/currency";
import InitialState from "../../../common/reducers/initialState";
    
export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      Constant.REQUEST_CURRENCY_PENDING,
      Constant.REQUEST_CURRENCY_REJECTED,
      Constant.REQUEST_CURRENCY_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      Constant.ARCHIVE_CURRENCY_PENDING,
      Constant.ARCHIVE_CURRENCY_REJECTED,
      Constant.ARCHIVE_CURRENCY_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      Constant.ADD_CURRENCY_PENDING,
      Constant.ADD_CURRENCY_REJECTED,
      Constant.ADD_CURRENCY_FULFILLED
    ];
    return reducer.add(state, action, constants);
  }
};
    