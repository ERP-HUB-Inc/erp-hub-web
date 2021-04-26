import Constant from "../../constants/settings/receiptTemplate";
import ReceiptService from "../../services/settings/ReceiptTemplateService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_RECEIPT,
        payload: ReceiptService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_RECEIPT,
        payload: ReceiptService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_RECEIPT,
        payload: ReceiptService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_RECEIPT,
        payload: ReceiptService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_RECEIPT,
        payload: null
      });
    };
  },
  default: () => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_RECEIPT,
        payload: ReceiptService.default()
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_RECEIPT_FORM,
        payload: data
      });
    };
  }
};

