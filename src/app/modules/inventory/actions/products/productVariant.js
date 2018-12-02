import Constant from "../../constants/products/productVariant";
import ProductVariantService from "../../services/products/ProductVariantService";

export default {
  checkIsAvailableForArchive: (id) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PRODUCT_VARIANT,
        payload: ProductVariantService.checkIsAvailableForArchive(id)
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

