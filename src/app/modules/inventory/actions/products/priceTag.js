import Constant from "../../constants/products/priceTag";

export default {
  selectProductFromListToPrint: (selectedProduct) => {
    return dispatch => {
      return dispatch({
        type: Constant.SELECT_PRODUCT_FROM_LIST_FOR_PRINT_PRICE_TAG,
        payload: selectedProduct
      });
    };
  },
  resetSelectProductFromListToPrint: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_SELECT_PRODUCT_FROM_LIST_FOR_PRINT_PRICE_TAG,
        payload: null
      });
    };
  }
};