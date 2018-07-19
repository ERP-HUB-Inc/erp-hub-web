  
import { 
  REQUEST_CURRENCY,
  ARCHIVE_CURRENCY
} from "../../constants/settings/currency";
import CurrencyService from "../../services/settings/CurrencyService";

export default {
  fetchCurrency: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: REQUEST_CURRENCY,
        payload: CurrencyService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type:  ARCHIVE_CURRENCY,
        payload: CurrencyService.archive(ids)
      });
    };
  }
};
