import Constant from "../../constants/stock/receivePurchase";
import supplierService from "../../services/stock/ReceivePurchaseService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RECEIVE_PURCHASE,
        payload: supplierService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_RECEIVE_PURCHASE,
        payload: supplierService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_RECEIVE_PURCHASE,
        payload: supplierService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RECEIVE_PURCHASE,
        payload: supplierService.update(data)
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
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_RECEIVE_PURCHASE_FORM,
        payload: data
      });
    };
  }
};

