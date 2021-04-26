import Constant from "../constants/businessType";
import BusinessTypeService from "../services/BusinessTypeService";

export function fetchAllBusinessTypeSystem() {
  return dispatch => {
    return dispatch({
      type: Constant.REQUEST_BUSINESS_TYPE,
      payload: BusinessTypeService.findSystemRecord()
    });
  };
}
