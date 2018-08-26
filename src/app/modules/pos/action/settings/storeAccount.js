  
import Constant from "../../constants/settings/storeAccount";
import StoreAccountService from "../../services/settings/StoreAccountService";

export default{
  fetch:(ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_ACCOUNT,
        payload: StoreAccountService.detail(ids)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STORE_ACCOUNT,
        payload: StoreAccountService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STORE_ACCOUNT,
        payload: StoreAccountService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STORE_ACCOUNT,
        payload: StoreAccountService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_STORE_ACCOUNT,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_STORE_ACCOUNT_FORM,
        payload: data
      });
    };
  }
};