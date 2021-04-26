import Constant from "../../constants/settings/privilege";
import PrivilegeService from "../../services/settings/PrivilegeService";

export default {
  fetch: (limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PRIVILEGE,
        payload: PrivilegeService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  checkPermission: (code) => {
    return dispatch => {
      return dispatch({
        type: Constant.CHECK_PERMISSION,
        payload: PrivilegeService.checkPermission(code)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_CHECK_PERMISSION,
        payload: null
      });
    };
  }
};

