import Constant from "../constants/users";
import UserService from "../services/UserService";

export default {
  fetch: (limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_USERS,
        payload: UserService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  }
};

