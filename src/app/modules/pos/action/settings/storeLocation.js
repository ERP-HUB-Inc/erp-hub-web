  
import { 
  REQUEST_STORE_LOCATION,
  ARCHIVE_STORE_LOCATION
} from "../../constants/settings/storeLocation";
import LoctionService from "../../services/settings/StoreLocationService";

export default{
  fetchstoreLocation:(limit, offset, sortField, sortOrder) => {
    return dispatch => {
      return dispatch({
        type: REQUEST_STORE_LOCATION,
        payload: LoctionService.lists(limit, offset, sortField, sortOrder)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: ARCHIVE_STORE_LOCATION,
        payload: LoctionService.archive(ids)
      });
    };
  }
};