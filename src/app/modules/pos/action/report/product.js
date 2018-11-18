  
import Constant from "../../constants/report/product";
import ProductService from "../../services/report/ProductService";

export default{
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_REPORT,
        payload: ProductService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PURCHASE_REPORT_FORM,
        payload: data
      });
    };
  }
};