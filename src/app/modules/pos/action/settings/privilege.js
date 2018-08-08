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
  }
};

