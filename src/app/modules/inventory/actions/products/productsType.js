import Constant from "../../constants/products/productsType";
import CategoryService from "@services/CategoryService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CATEGORY,
        payload: CategoryService.get({ limit, offset, sortField, sortOrder })
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_CATEGORY,
        payload: CategoryService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_CATEGORY,
        payload: CategoryService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_CATEGORY,
        payload: CategoryService.update(data)
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
        payload: CategoryService.getById(data.id)
      });
    };
  }
};

