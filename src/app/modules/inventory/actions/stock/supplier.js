import Constant from "../../constants/stock/supplier";
import supplierService from "../../services/stock/StockManagementService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER,
        payload: supplierService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  detail: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER_DETAIL,
        payload: supplierService.detail(ids)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_SUPPLIER,
        payload: supplierService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_SUPPLIER,
        payload: supplierService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_SUPPLIER,
        payload: supplierService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_SUPPLIER,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_SUPPLIER_FORM,
        payload: data
      });
    };
  }
};

