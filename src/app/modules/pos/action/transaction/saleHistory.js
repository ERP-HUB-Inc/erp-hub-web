  
import Constant from "../../constants/transactions/saleHistory";
import SaleHistoryService from "../../services/transactions/saleHistory";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SALE_HISTORY,
        payload: SaleHistoryService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type:  Constant.ARCHIVE_SALE_HISTORY,
        payload: SaleHistoryService.archive(ids)
      });
    };
  },
 
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_SALE_HISTORY,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_SALE_HISTORY_FORM,
        payload: data
      });
    };
  }
};
