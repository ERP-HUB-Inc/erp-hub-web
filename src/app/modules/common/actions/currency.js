import Constant from "../constants/currency";
import CurrencyService from "../services/CurrencyService";

export function fetchAllCurrencySystem() {
  return dispatch => {
    return dispatch({
      type: Constant.REQUEST_CURRENCY,
      payload: CurrencyService.findSystemRecord()
    });
  };
}
