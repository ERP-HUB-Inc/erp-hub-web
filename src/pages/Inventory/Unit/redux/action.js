import Constant from "./constant";
import UnitService from "@services/UnitService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_UNIT,
        payload: UnitService.get(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_UNIT,
        payload: UnitService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_UNIT,
        payload: UnitService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_UNIT,
        payload: UnitService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_UNIT,
        payload: null
      });
    };
  },
  resetFetch: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_UNIT_RESET,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_UNIT_FORM,
        payload: data
      });
    };
  }
};

