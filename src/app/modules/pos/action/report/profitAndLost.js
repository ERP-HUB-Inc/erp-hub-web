  
import Constant from "../../constants/report/profitAndLost";
import ProfitAndLostService from "../../services/report/ProfitAndLostService";

export default{
  fetch:(filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PROFIT_AND_LOST_REPORT,
        payload: ProfitAndLostService.listsSearch(filter, searchKey)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_PROFIT_AND_LOST_REPORT,
        payload: null
      });
    };
  }
};