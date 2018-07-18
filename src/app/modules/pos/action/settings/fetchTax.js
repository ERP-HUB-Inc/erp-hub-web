import { REQUEST_TAX } from "../../constants/settings/tax";
import TaxService from "../../services/settings/TaxService";
export function fetchTax(limit, offset, sortField, sortOrder) {
  return dispatch => {
    return dispatch({
      type: REQUEST_TAX,
      payload: TaxService.lists(limit, offset, sortField, sortOrder)
    });
  };
}