  
import Constant from "../../constants/settings/storeLanguage";
import LanguageService from "../../services/settings/StoreLanguageService";

export default {
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_LANGUAGE,
        payload: LanguageService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type:  Constant.ARCHIVE_STORE_LANGUAGE,
        payload: LanguageService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STORE_LANGUAGE,
        payload: LanguageService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STORE_LANGUAGE,
        payload: LanguageService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_STORE_LANGUAGE,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_STORE_LANGUAGE_FORM,
        payload: data
      });
    };
  }
};