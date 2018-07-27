import {
  REQUEST_USERS
} from "../constants/users";
import UserService from "../services/UserService";

export function fetchUsers() {
  return dispatch => {
    return dispatch({
      type: REQUEST_USERS,
      payload: UserService.lists()
    });
  };
}
