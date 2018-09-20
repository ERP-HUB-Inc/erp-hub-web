  
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
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_INVENTORY_REPORT,
        payload: SaleReportService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_INVENTORY_REPORT,
        payload: SaleReportService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_INVENTORY_REPORT,
        payload: SaleReportService.update(data, id)
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
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_INVENTORY_REPORT_FORM,
        payload: data
      });
    };
  }
};