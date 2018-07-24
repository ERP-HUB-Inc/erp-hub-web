  
import Constant from "../../constants/settings/storeLanguage";
import LanguageService from "../../services/settings/StoreLanguage";

export default {
  fetch:(limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_LANGUAGE,
        payload: LanguageService.lists(limit, offset, sortField, sortOrder)
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
  }
};