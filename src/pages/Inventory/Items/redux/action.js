import Constant from "./constant";
import ProductService from "@services/ProductService";
import LocationService from "@services/LocationService";
import VariantService from "@services/VariantService";
import OptionService from "@services/OptionService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, locationId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT,
        payload: ProductService.get({ limit, offset, sortField, sortOrder, filter, searchKey, locationId })
      });
    };
  },
  fetchLocation: (limit, offset, sortField, sortOrder, filter, searchKey, locationId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_LOCATION,
        payload: LocationService.get({ limit, offset, sortField, sortOrder, filter, searchKey, locationId })
      });
    };
  },
  fetchAttributes: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_ATTRIBUTES,
        payload: ProductService.attributes(id)
      });
    };
  },
  fetchVariantAttributes: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_VARIANT_ATTRIBUTE,
        payload: OptionService.get(id)
      });
    };
  },
  fetchLog: (id, limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_LOG,
        payload: ProductService.logList(id, limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  fetchCostLog: (id, limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_COST_LOG,
        payload: ProductService.costLogList(id, limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  search: (limit, offset, sortField, sortOrder, filter, searchKey, searchFor, isSearchingBarcode) => {
    return dispatch => {
      return dispatch({
        type: Constant.SEARCH_PRODUCT,
        payload: ProductService.searchForDrowDown(limit, offset, sortField, sortOrder, filter, searchKey, searchFor, isSearchingBarcode)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PRODUCT,
        payload: ProductService.archive(ids)
      });
    };
  },
  archiveVariant: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_VARIANT_PRODUCT,
        payload: ProductService.archiveVariant(id)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PRODUCT,
        payload: ProductService.add(data)
      });
    };
  },
  clone: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.CLONE_PRODUCT,
        payload: ProductService.clone(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCT,
        payload: ProductService.update(data)
      });
    };
  },
  changeProductVariantStatus: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PRODUCT,
        payload: ProductService.changeProductVariantStatus(id)
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
  checkIsAvailableVariantForArchive: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_VARIANT,
        payload: VariantService.checkIsAvailableForArchive(id)
      });
    };
  },
  checkIsAvailableVariantArchiveAttributeValue: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_ATTRIBUTE_VALUE,
        payload: VariantService.checkIsAvailableArchiveAttributeValue(id)
      });
    };
  },
  checkIsAvailableVariantArchiveAttribute: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_ATTRIBUTE,
        payload: VariantService.checkIsAvailableArchiveAttribute(id)
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
        payload: ProductService.getById(data.id, data.productOption)
      });
    };
  },
  showBrandForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_BRAND_FORM,
        payload: data
      });
    };
  },
  showCategoryForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_CATEGORY_FORM,
        payload: data
      });
    };
  },
  showVariantOptionForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_VARIANT_ATTRIBUTE_FORM,
        payload: data
      });
    };
  },
  showTaxForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_TAX_FORM,
        payload: data
      });
    };
  },
  showUnitForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_UNIT_FORM,
        payload: data
      });
    };
  },
  uploadFile: (formData) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPLOAD_PRODUCT_IMAGE,
        payload: ProductService.uploadFile(formData)
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

