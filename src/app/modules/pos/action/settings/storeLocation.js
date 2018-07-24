  
import Constant from "../../constants/settings/storeLocation";
import LoctionService from "../../services/settings/StoreLocationService";

export default{
  fetch:(limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_LOCATION,
        payload: LoctionService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_STORE_LOCATION,
        payload: LoctionService.archive(ids)
      });
    };
  }
};