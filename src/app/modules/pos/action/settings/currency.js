  
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
  }
};
