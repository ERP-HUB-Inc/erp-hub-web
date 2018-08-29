import Constant from "../../constants/stock/purchaseOrder";
import purchaseOrderService from "../../services/stock/PurchaseOrderService";

export default {
  orderNumber: (column, value) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER_NUMBER,
        payload: purchaseOrderService.findPurchaseOrderNumber({column, value})
      });
    };
  },
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER,
        payload: purchaseOrderService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PURCHASE_ORDER,
        payload: purchaseOrderService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PURCHASE_ORDER,
        payload: purchaseOrderService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PURCHASE_ORDER,
        payload: purchaseOrderService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_PURCHASE_ORDER,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PURCHASE_ORDER_FORM,
        payload: data
      });
    };
  }
};

