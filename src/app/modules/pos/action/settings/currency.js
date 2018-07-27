  
import Constant from "../../constants/settings/currency";
import CurrencyService from "../../services/settings/CurrencyService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CURRENCY,
        payload: CurrencyService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type:  Constant.ARCHIVE_CURRENCY,
        payload: CurrencyService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_CURRENCY,
        payload: CurrencyService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_CURRENCY,
        payload: CurrencyService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_CURRENCY,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_CURRENCY_FORM,
        payload: data
      });
    };
  }
};
