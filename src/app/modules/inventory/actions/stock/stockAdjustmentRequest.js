import Constant from "../../constants/stock/stockAdjustmentRequest";
import StockAdjustmentRequestService from "../../services/stock/StockAdjustmentRequestService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST,
        payload: StockAdjustmentRequestService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STOCK_ADJUSTMENT_REQUEST,
        payload: StockAdjustmentRequestService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STOCK_ADJUSTMENT_REQUEST,
        payload: StockAdjustmentRequestService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STOCK_ADJUSTMENT_REQUEST,
        payload: StockAdjustmentRequestService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_STOCK_ADJUSTMENT_REQUEST) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: (data, SHOW_STOCK_ADJUSTMENT_REQUEST_FORM = Constant.SHOW_STOCK_ADJUSTMENT_REQUEST_FORM) => {
    return dispatch => {
      return dispatch({
        type: SHOW_STOCK_ADJUSTMENT_REQUEST_FORM,
        payload: data
      });
    };
  },

  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_ADJUSTMENT_REQUEST_DETAIL,
        payload: StockAdjustmentRequestService.detail(data.id)
      });
    };
  }
};

