  
import Constant from "../../constants/settings/storeLocation";
import LoctionService from "../../services/settings/StoreLocationService";

export default{
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_LOCATION,
        payload: LoctionService.lists(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  fetchAllByStoreName:(storeName) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_STORE_LOCATION,
        payload: LoctionService.findLocationByStoreName(storeName)
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
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_STORE_LOCATION,
        payload: LoctionService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_STORE_LOCATION,
        payload: LoctionService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_STORE_LOCATION,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_STORE_LOCATION_FORM,
        payload: data
      });
    };
  }
};