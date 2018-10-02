  
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
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_PROFIT_AND_LOST_REPORT,
        payload: ProfitAndLostService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_PROFIT_AND_LOST_REPORT,
        payload: ProfitAndLostService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_PROFIT_AND_LOST_REPORT,
        payload: ProfitAndLostService.update(data, id)
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
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_PROFIT_AND_LOST_REPORT_FORM,
        payload: data
      });
    };
  }
};