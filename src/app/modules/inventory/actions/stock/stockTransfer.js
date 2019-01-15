import Constant from "../../constants/stock/stockTransfer";
import StockTransferService from "../../services/stock/StockTransferService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_TRANSFER,
        payload: StockTransferService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STOCK_TRANSFER,
        payload: StockTransferService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STOCK_TRANSFER,
        payload: StockTransferService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STOCK_TRANSFER,
        payload: StockTransferService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_STOCK_TRANSFER,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_STOCK_TRANSFER_FORM,
        payload: data
      });
    };
  }
};

