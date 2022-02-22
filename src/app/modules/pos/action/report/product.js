  
import Constant from "../../constants/report/product";
import ProductService from "../../services/report/ProductService";

export default{
  getProductReport:(option) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRODUCT_REPORT,
        payload: ProductService.getProductReport(option)
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