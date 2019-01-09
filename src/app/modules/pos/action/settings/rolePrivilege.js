import Constant from "../../constants/settings/rolePrivilege";
import RolePrivilegeService from "../../services/settings/RolePrivilegeService";
import RoleAccessService from "../../services/settings/RoleAccessService";

export default {
  fetch: (roleId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_ROLE_PRIVILEGE,
        payload: RolePrivilegeService.lists(roleId)
      });
    };
  },

  assignPrivilege: (roleId, data) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_ROLE_PRIVILEGE,
        payload: RoleAccessService.assignPrivilege(roleId, data)
      });
    };
  },

  reset: (RESET_CONSTANT = Constant.RESET_ROLE_PRIVILEGE) => {
    return dispatch => {
      return dispatch({
        type: RESET_CONSTANT,
        payload: null
      });
    };
  },
};

