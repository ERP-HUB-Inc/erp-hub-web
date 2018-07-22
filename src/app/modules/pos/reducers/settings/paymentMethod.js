import {
  REQUEST_PAYMENT_METHOD_PENDING,
  REQUEST_PAYMENT_METHOD_REJECTED,
  REQUEST_PAYMENT_METHOD_FULFILLED,
  ARCHIVE_PAYMENT_METHOD_PENDING,
  ARCHIVE_PAYMENT_METHOD_REJECTED,
  ARCHIVE_PAYMENT_METHOD_FULFILLED,
  ADD_PAYMENT_METHOD_PENDING,
  ADD_PAYMENT_METHOD_REJECTED,
  ADD_PAYMENT_METHOD_FULFILLED,
  SHOW_PAYMENT_METHOD_FORM,
  RESET_PAYMENT_METHOD
} from "../../constants/settings/paymentMethod";
import InitialState from "../../../common/reducers/initialState";
import reducer from "../reducer";

export default {
  request: (state = InitialState.request(), action) => {
    const constants = [
      REQUEST_PAYMENT_METHOD_PENDING,
      REQUEST_PAYMENT_METHOD_REJECTED,
      REQUEST_PAYMENT_METHOD_FULFILLED
    ];
    return reducer.request(state, action, constants);
  },
  archive: (state = InitialState.archive(), action) => {
    const constants = [
      ARCHIVE_PAYMENT_METHOD_PENDING,
      ARCHIVE_PAYMENT_METHOD_REJECTED,
      ARCHIVE_PAYMENT_METHOD_FULFILLED
    ];
    return reducer.archive(state, action, constants);
  },
  add: (state = InitialState.add(), action) => {
    const constants = [
      ADD_PAYMENT_METHOD_PENDING,
      ADD_PAYMENT_METHOD_REJECTED,
      ADD_PAYMENT_METHOD_FULFILLED,
      SHOW_PAYMENT_METHOD_FORM,
      RESET_PAYMENT_METHOD
    ];
    return reducer.add(state, action, constants);
  }
};
