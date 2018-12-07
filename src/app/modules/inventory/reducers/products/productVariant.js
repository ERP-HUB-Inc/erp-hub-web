import {combineReducers} from "redux";
import Constant from "../../constants/products/productVariant";
import reducer from "../../../common/reducers/reducer";
import InitialState from "../../../common/reducers/initialState";

export default combineReducers({
  checkStatus: (state = InitialState.request(), action) => {
    const constants = [
      Constant.CHECK_PRODUCT_VARIANT_PENDING,
      Constant.CHECK_PRODUCT_VARIANT_REJECTED,
      Constant.CHECK_PRODUCT_VARIANT_FULFILLED,
      Constant.RESET_PRODUCT_VARIANT
    ];
    return reducer.request(state, action, constants);
  },
  checkStatusAttribute: (state = InitialState.request(), action) => {
    const constants = [
      Constant.CHECK_PRODUCT_ATTRIBUTE_PENDING,
      Constant.CHECK_PRODUCT_ATTRIBUTE_REJECTED,
      Constant.CHECK_PRODUCT_ATTRIBUTE_FULFILLED,
      Constant.RESET_PRODUCT_VARIANT
    ];
    return reducer.request(state, action, constants);
  },
  checkStatusAttributeValue: (state = InitialState.request(), action) => {
    const constants = [
      Constant.CHECK_PRODUCT_ATTRIBUTE_VALUE_PENDING,
      Constant.CHECK_PRODUCT_ATTRIBUTE_VALUE_REJECTED,
      Constant.CHECK_PRODUCT_ATTRIBUTE_VALUE_FULFILLED,
      Constant.RESET_PRODUCT_VARIANT
    ];
    return reducer.request(state, action, constants);
  }
});
