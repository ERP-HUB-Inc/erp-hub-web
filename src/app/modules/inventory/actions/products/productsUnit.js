import Constant from "../../constants/products/productsUnit";
import productsUnitService from "../../services/products/productsUnit";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCTS_UNIT,
        payload: productsUnitService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PRODUCTS_UNIT,
        payload: productsUnitService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PRODUCTS_UNIT,
        payload: productsUnitService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCTS_UNIT,
        payload: productsUnitService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_PRODUCTS_UNIT,
        payload: null
      });
    };
  },
  resetFetch: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCTS_UNIT_RESET,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PRODUCTS_UNIT_FORM,
        payload: data
      });
    };
  }
};

