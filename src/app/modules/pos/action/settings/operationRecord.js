import Constant from "../../constants/settings/operationRecord";
import OperationRecordService from "../../services/settings/OperationRecordService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey, dates) => {
    return (dispatch) => {
      return dispatch({
        type: Constant.REQUEST_OPERATION_RECORD,
        payload: OperationRecordService.lists(
          limit,
          offset,
          sortField,
          sortOrder,
          filter,
          searchKey,
          dates
        ),
      });
    };
  },
  archive: (ids) => {
    return (dispatch) => {
      return dispatch({
        type: Constant.ARCHIVE_OPERATION_RECORD,
        payload: OperationRecordService.archive(ids),
      });
    };
  },
  add: (data) => {
    return (dispatch) => {
      return dispatch({
        type: Constant.ADD_OPERATION_RECORD,
        payload: OperationRecordService.add(data),
      });
    };
  },
  update: (data, id) => {
    return (dispatch) => {
      return dispatch({
        type: Constant.UPDATE_OPERATION_RECORD,
        payload: OperationRecordService.update(data, id),
      });
    };
  },
  reset: () => {
    return (dispatch) => {
      return dispatch({
        type: Constant.RESET_OPERATION_RECORD,
        payload: null,
      });
    };
  },
  showForm: (data) => {
    return (dispatch) => {
      return dispatch({
        type: Constant.SHOW_OPERATION_RECORD_FORM,
        payload: data,
      });
    };
  },
};
