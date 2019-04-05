import Constant from "../../constants/products/productsType";
import ProductsTypeService from "../../services/products/ProductsTypeService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCTS_TYPE,
        payload: ProductsTypeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PRODUCTS_TYPE,
        payload: ProductsTypeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PRODUCTS_TYPE,
        payload: ProductsTypeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCTS_TYPE,
        payload: ProductsTypeService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_PRODUCTS_TYPE) => {
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
        type: Constant.SHOW_PRODUCTS_TYPE_FORM,
        payload: data
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_PRODUCTS_TYPE,
        payload: ProductsTypeService.detail(data.id)
      });
    };
  }
};

