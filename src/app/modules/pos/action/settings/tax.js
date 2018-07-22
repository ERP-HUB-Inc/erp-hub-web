  
import { 
  REQUEST_TAX,
  ARCHIVE_TAX
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
  }
};