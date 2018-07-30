import Constant from "../../constants/settings/roleAccess";
import RoleAccessService from "../../services/settings/RoleAccessService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_ROLE_ACCESS,
        payload: RoleAccessService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_ROLE_ACCESS,
        payload: RoleAccessService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_ROLE_ACCESS,
        payload: RoleAccessService.add(data)
      });
    };
  },
  update: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_ROLE_ACCESS,
        payload: RoleAccessService.update(data)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_ROLE_ACCESS,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_ROLE_ACCESS_FORM,
        payload: data
      });
    };
  }
};

