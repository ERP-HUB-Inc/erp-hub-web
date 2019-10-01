import Constant from "../../constants/transactions/quotation";
import QuotationService from "../../services/transactions/QuotationService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, rangFilter) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_QUOTATION,
        payload: QuotationService.lists(limit, offset, sortField, sortOrder, filter, searchKey, rangFilter)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_QUOTATION,
        payload: QuotationService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_QUOTATION,
        payload: QuotationService.update(data)
      });
    };
  },
  detail: (data, languageId) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_QUOTATION,
        payload: QuotationService.detail(data, languageId)
      });
    };
  },
  reset: (RESET_CONSTANT = Constant.RESET_QUOTATION) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_QUOTATION_FORM,
        payload: data
      });
    };
  }
};
