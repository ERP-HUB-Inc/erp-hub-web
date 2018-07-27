import Constant from "../constants/language";
import LanguageService from "../services/LanguageService";

export function fetchAllLanguageSystem() {
  return dispatch => {
    return dispatch({
      type: Constant.REQUEST_LANGUAGE,
      payload: LanguageService.findSystemRecord()
    });
  };
}
