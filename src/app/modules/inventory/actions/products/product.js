import Constant from "../../constants/products/product";
import ItemService from "@services/ItemService";

export default {
  fetch: (props = {limit, offset, sortField, sortOrder, filter, search, locationId}) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT,
        payload: ItemService.get(props)
      });
    };
  },
  fetchAttributes: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_ATTRIBUTES,
        payload: ItemService.attributes(id),
      });
    };
  },
  fetchLog: (id, limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_LOG,
        payload: ItemService.logList(id, limit, offset, sortField, sortOrder, filter, searchKey),
      });
    };
  },
  fetchCostLog: (id, limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_COST_LOG,
        payload: ItemService.costLogList(id, limit, offset, sortField, sortOrder, filter, searchKey),
      });
    };
  },
  search: (limit, offset, sortField, sortOrder, filter, searchKey, searchFor, isSearchingBarcode) => {
    return dispatch => {
      return dispatch({
        type: Constant.SEARCH_PRODUCT,
        payload: ItemService.searchForDrowDown(limit, offset, sortField, sortOrder, filter, searchKey, searchFor, isSearchingBarcode),
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PRODUCT,
        payload: ItemService.archive(ids),
      });
    };
  },
  archiveVariant: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_VARIANT_PRODUCT,
        payload: ItemService.archiveVariant(id)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PRODUCT,
        payload: ItemService.add(data)
      });
    };
  },
  clone: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.CLONE_PRODUCT,
        payload: ItemService.clone(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCT,
        payload: ItemService.update(data)
      });
    };
  },
  changeProductVariantStatus: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCT,
        payload: ItemService.changeProductVariantStatus(id)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_PRODUCT) => {
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
        type: Constant.SHOW_PRODUCT_FORM,
        payload: data
      });
    };
  },
  requestAndShowForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_PRODUCTS,
        payload: ItemService.detail(data.id, data.productOption)
      });
    };
  },
  uploadFile: (formData) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPLOAD_PRODUCT_IMAGE,
        payload: ItemService.uploadFile(formData)
      });
    };
  },
  switchTypeOfGenerateSKU: (value) => {
    return dispatch => {
      return dispatch({
        type: Constant.SWITCH_TYPE_OF_GENERATE_SKU,
        payload: value
      });
    };
  }
};

