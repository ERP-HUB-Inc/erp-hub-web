  
import Constant from "../../constants/report/inventory";
import SaleReportService from "../../services/report/InventoryService";

export default{
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_INVENTORY_REPORT,
        payload: SaleReportService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_INVENTORY_REPORT,
        payload: null
      });
    };
  }
};