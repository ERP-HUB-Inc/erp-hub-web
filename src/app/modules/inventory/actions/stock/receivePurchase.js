import Constant from "../../constants/stock/receivePurchase";
import ReceivePurchaseService from "../../services/stock/ReceivePurchaseService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RECEIVE_PURCHASE,
        payload: ReceivePurchaseService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_RECEIVE_PURCHASE,
        payload: ReceivePurchaseService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_RECEIVE_PURCHASE,
        payload: ReceivePurchaseService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RECEIVE_PURCHASE,
        payload: ReceivePurchaseService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_RECEIVE_PURCHASE,
        payload: null
      });
    };
  },
  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.RECEIVE_PURCHASE_ORDER_DETAIL,
        payload: ReceivePurchaseService.detail(data.id)
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_RECEIVE_PURCHASE_FORM,
        payload: data
      });
    };
  }
};

