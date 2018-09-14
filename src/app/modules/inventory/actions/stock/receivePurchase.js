import Constant from "../../constants/stock/receivePurchase";
import receivePurchaseService from "../../services/stock/ReceivePurchaseService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RECEIVE_PURCHASE,
        payload: receivePurchaseService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_RECEIVE_PURCHASE,
        payload: receivePurchaseService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_RECEIVE_PURCHASE,
        payload: receivePurchaseService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RECEIVE_PURCHASE,
        payload: receivePurchaseService.update(data)
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
        payload: receivePurchaseService.detail(data.id)
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

