import Constant from "../../constants/stockManagement";
import stockManagementService from "../../services/stockManagement/StockManagementService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_MANAGEMENT,
        payload: stockManagementService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STOCK_MANAGEMENT,
        payload: stockManagementService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STOCK_MANAGEMENT,
        payload: stockManagementService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STOCK_MANAGEMENT,
        payload: stockManagementService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_STOCK_MANAGEMENT,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_STOCK_MANAGEMENT_FORM,
        payload: data
      });
    };
  }
};

