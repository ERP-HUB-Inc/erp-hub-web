  
import Constant from "../../constants/report/sale";
import SaleReportService from "../../services/report/SaleService";

export default{
  fetch:(filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_SALE_REPORT,
        payload: SaleReportService.listsSearch(filter, searchKey)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_SALE_REPORT,
        payload: null
      });
    };
  }
};