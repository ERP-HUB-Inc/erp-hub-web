  
import Constant from "../../constants/report/purchase";
import PurchaseService from "../../services/report/PurchaseService";

export default{
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_REPORT,
        payload: PurchaseService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_PURCHASE_REPORT,
        payload: null
      });
    };
  }
};