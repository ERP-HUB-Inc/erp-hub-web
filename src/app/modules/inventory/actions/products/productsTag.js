import Constant from "../../constants/products/productsTag";
import ProductsTagService from "../../services/products/ProductsTagService";

export default {
  fetch: (limit, offset, sortField,  sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCTS_TAG,
        payload: ProductsTagService.lists(limit, offset, sortField,  sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PRODUCTS_TAG,
        payload: ProductsTagService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PRODUCTS_TAG,
        payload: ProductsTagService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCTS_TAG,
        payload: ProductsTagService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_PRODUCTS_TAG,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PRODUCTS_TAG_FORM,
        payload: data
      });
    };
  }
};

