import Constant from "../../constants/settings/rolePrivilege";
import RolePrivilegeService from "../../services/settings/RolePrivilegeService";

export default {
  fetch: (roleId) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_ROLE_PRIVILEGE,
        payload: RolePrivilegeService.lists(roleId)
      });
    };
  }
};

