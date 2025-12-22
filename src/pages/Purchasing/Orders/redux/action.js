import Constant from "./constant";
import PurchaseOrderService from "@services/PurchaseOrderService";
import VendorService from "@services/VendorService";
import UnitService from "@services/UnitService";

export default {
  orderNumber: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER_NUMBER,
        payload: PurchaseOrderService.findPurchaseOrderNumber(ids)
      });
    };
  },
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER,
        payload: PurchaseOrderService.get(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  fetchSupplier: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER,
        payload: VendorService.get(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  fetchUnit: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER,
        payload: UnitService.get(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PURCHASE_ORDER,
        payload: PurchaseOrderService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PURCHASE_ORDER,
        payload: PurchaseOrderService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PURCHASE_ORDER,
        payload: PurchaseOrderService.update(data)
      });
    };
  },
  pushToSupplier: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER,
        payload: PurchaseOrderService.update(data)
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

  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PURCHASE_ORDER_DETAIL,
        payload: PurchaseOrderService.getById(data.id)
      });
    };
  }
};

