import Constant from "../../constants/stock/stockAdjustmentApprove";
import StockAdjustmentApproveService from "../../services/stock/StockAdjustmentApproveService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE,
        payload: StockAdjustmentApproveService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STOCK_ADJUSTMENT_APPROVE,
        payload: StockAdjustmentApproveService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STOCK_ADJUSTMENT_APPROVE,
        payload: StockAdjustmentApproveService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STOCK_ADJUSTMENT_APPROVE,
        payload: StockAdjustmentApproveService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_STOCK_ADJUSTMENT_APPROVE) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: (data, SHOW_STOCK_ADJUSTMENT_APPROVE_FORM = Constant.SHOW_STOCK_ADJUSTMENT_APPROVE_FORM) => {
    return dispatch => {
      return dispatch({
        type: SHOW_STOCK_ADJUSTMENT_APPROVE_FORM,
        payload: data
      });
    };
  },

  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_ADJUSTMENT_APPROVE_DETAIL,
        payload: StockAdjustmentApproveService.detail(data.id)
      });
    };
  }
};

