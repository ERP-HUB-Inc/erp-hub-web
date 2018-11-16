import Constant from "../../constants/stock/supplier";
import SupplierService from "../../services/stock/SupplierService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER,
        payload: SupplierService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  detail: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SUPPLIER_DETAIL,
        payload: SupplierService.detail(ids)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_SUPPLIER,
        payload: SupplierService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_SUPPLIER,
        payload: SupplierService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_SUPPLIER,
        payload: SupplierService.update(data)
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

