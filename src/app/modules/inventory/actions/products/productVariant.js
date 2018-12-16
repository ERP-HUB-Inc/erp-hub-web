import Constant from "../../constants/products/productVariant";
import ProductVariantService from "../../services/products/ProductVariantService";

export default {
  fetchByAttributeValue: (attributeValueId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_VARIANT,
        payload: ProductVariantService.fetchByAttributeValue(attributeValueId)
      });
    };
  },
  checkIsAvailableForArchive: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_VARIANT,
        payload: ProductVariantService.checkIsAvailableForArchive(id)
      });
    };
  },
  checkIsAvailableArchiveAttributeValue: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_ATTRIBUTE_VALUE,
        payload: ProductVariantService.checkIsAvailableArchiveAttributeValue(id)
      });
    };
  },
  checkIsAvailableArchiveAttribute: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_ATTRIBUTE,
        payload: ProductVariantService.checkIsAvailableArchiveAttribute(id)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_PRODUCT_VARIANT) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
};

