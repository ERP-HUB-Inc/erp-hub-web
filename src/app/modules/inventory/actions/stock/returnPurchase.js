import Constant from "../../constants/stock/returnPurchase";
import returnPurchaseService from "../../services/stock/ReturnPurchaseService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RETURN_PURCHASE,
        payload: returnPurchaseService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_RETURN_PURCHASE,
        payload: returnPurchaseService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_RETURN_PURCHASE,
        payload: returnPurchaseService.add(data)
      });
    };
  },
  detail:(data) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RETURN_PURCHASE_DETAIL,
        payload: returnPurchaseService.detail(data.id)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RETURN_PURCHASE,
        payload: returnPurchaseService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_RETURN_PURCHASE,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_RETURN_PURCHASE_FORM,
        payload: data
      });
    };
  }
};

