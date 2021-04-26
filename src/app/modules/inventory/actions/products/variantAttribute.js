import Constant from "../../constants/products/variantAttribute";
import VariantAttributeService from "../../services/products/VariantAttributeService";

export default {
  fetch: (limit, offset, sortField,  sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_VARIANT_ATTRIBUTE,
        payload: VariantAttributeService.lists(limit, offset, sortField,  sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_VARIANT_ATTRIBUTE,
        payload: VariantAttributeService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_VARIANT_ATTRIBUTE,
        payload: VariantAttributeService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_VARIANT_ATTRIBUTE,
        payload: VariantAttributeService.update(data)
      });
    };
  },
  reset: (CONSTANT_RESET = Constant.RESET_VARIANT_ATTRIBUTE) => {
    return dispatch => {
      return dispatch({
        type: CONSTANT_RESET,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_VARIANT_ATTRIBUTE_FORM,
        payload: data
      });
    };
  }
};

