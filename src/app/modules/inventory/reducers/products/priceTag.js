import {combineReducers} from "redux";
import Constant from "../../constants/products/priceTag";

export default combineReducers({
  selectProductToPrint: (state = {selectedProduct: [], passedTo: false}, action) => {
    switch(action.type) {
    case Constant.SELECT_PRODUCT_FROM_LIST_FOR_PRINT_PRICE_TAG: {
      return {
        selectedProduct: action.payload,
        passedTo: true
      };
    }
    case Constant.RESET_SELECT_PRODUCT_FROM_LIST_FOR_PRINT_PRICE_TAG: {
      return {
        selectedProduct: [],
        passedTo: false
      };
    }
    default:
      return state;
    }
  }
});