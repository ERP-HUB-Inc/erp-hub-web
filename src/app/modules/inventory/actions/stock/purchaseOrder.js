import Constant from "../../constants/stock/purchaseOrder";
import purchaseOrderService from "../../services/stock/PurchaseOrderService";

export default {
  orderNumber: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER_NUMBER,
        payload: purchaseOrderService.findPurchaseOrderNumber(ids)
      });
    };
  },
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER,
        payload: purchaseOrderService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
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
  pushToSupplier: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER,
        payload: purchaseOrderService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_PURCHASE_ORDER) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: (data, SHOW_PURCHASE_ORDER_FORM = Constant.SHOW_PURCHASE_ORDER_FORM) => {
    return dispatch => {
      return dispatch({
        type: SHOW_PURCHASE_ORDER_FORM,
        payload: data
      });
    };
  },

  detail:(data, languageId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER_DETAIL,
        payload: purchaseOrderService.detail(data.id, languageId)
      });
    };
  }
};

