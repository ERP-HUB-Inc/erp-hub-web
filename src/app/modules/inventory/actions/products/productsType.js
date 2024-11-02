import Constant from "../../constants/products/productsType";
import ProductsTypeService from "../../services/products/ProductsTypeService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CATEGORY,
        payload: ProductsTypeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_CATEGORY,
        payload: ProductsTypeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_CATEGORY,
        payload: ProductsTypeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_CATEGORY,
        payload: ProductsTypeService.update(data)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_CATEGORY) => {
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
        type: Constant.SHOW_CATEGORY_FORM,
        payload: data
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_CATEGORY,
        payload: ProductsTypeService.detail(data.id)
      });
    };
  }
};

