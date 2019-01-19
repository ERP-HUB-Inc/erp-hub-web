import Constant from "../../constants/stock/stockTransfer";
import StockTransferService from "../../services/stock/StockTransferService";
import ApproveTransferService from "../../services/stock/ApproveTransferService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_TRANSFER,
        payload: StockTransferService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  fetchReceive: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_TRANSFER,
        payload: StockTransferService.listsReceive(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
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
  reset: (RESET_CONSTANT = Constant.RESET_STOCK_TRANSFER) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
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
  },
  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STOCK_TRANSFER_DETAIL,
        payload: StockTransferService.detail(data.id)
      });
    };
  },
  approve: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.APPROVE_STOCK_TRANSFER,
        payload: ApproveTransferService.update(data)
      });
    };
  },
  cancel: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.CANCEL_STOCK_TRANSFER,
        payload: StockTransferService.cancle(data)
      });
    };
  },
};

