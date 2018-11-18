  
import Constant from "../../constants/settings/currencyExchange";
import CurrencyService from "../../services/settings/CurrencyExchangeService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CURRENCY_EXCHANGE,
        payload: CurrencyService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type:  Constant.ARCHIVE_CURRENCY_EXCHANGE,
        payload: CurrencyService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_CURRENCY_EXCHANGE,
        payload: CurrencyService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_CURRENCY_EXCHANGE,
        payload: CurrencyService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_CURRENCY_EXCHANGE,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_CURRENCY_EXCHANGE_FORM,
        payload: data
      });
    };
  }
};
