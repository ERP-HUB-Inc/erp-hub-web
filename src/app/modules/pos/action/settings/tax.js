  
import { 
  REQUEST_TAX,
  ARCHIVE_TAX,
  ADD_TAX,
  RESET_TAX,
  SHOW_TAX_FORM
} from "../../constants/settings/tax";
import TaxService from "../../services/settings/TaxService";

export default{
  fetch:(limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: REQUEST_TAX,
        payload: TaxService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: ARCHIVE_TAX,
        payload: TaxService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: ADD_TAX,
        payload: TaxService.add(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: RESET_TAX,
        payload: null
      });
    };
  },
  showForm: () => {
    return dispatch => {
      return dispatch({
        type: SHOW_TAX_FORM,
        payload: null
      });
    };
  }
};