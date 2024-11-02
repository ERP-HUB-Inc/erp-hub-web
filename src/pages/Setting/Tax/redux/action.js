  
import Constant from "./constant";
import TaxService from "@services/TaxService";

export default{
  fetch:(limit, offset, sortField, sortOrder, filter, searchKey) => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_TAX,
        payload: TaxService.get(limit, offset, sortField, sortOrder, filter, searchKey)
      });
    };
  },
  detail:(id) => {
    return dispatch => {
      return dispatch({
        type: Constant.DETAIL_TAX,
        payload: TaxService.getById(id)
      });
    };
  },
  archive: (ids) => {
    return dispatch => {
      return dispatch({
        type: Constant.ARCHIVE_TAX,
        payload: TaxService.archive(ids)
      });
    };
  },
  add: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.ADD_TAX,
        payload: TaxService.add(data)
      });
    };
  },
  update: (data, id) => {
    return dispatch => {
      return dispatch({
        type: Constant.UPDATE_TAX,
        payload: TaxService.update(data, id)
      });
    };
  },
  reset: () => {
    return dispatch => {
      return dispatch({
        type: Constant.RESET_TAX,
        payload: null
      });
    };
  },
  showForm: (data) => {
    return dispatch => {
      return dispatch({
        type: Constant.SHOW_TAX_FORM,
        payload: data
      });
    };
  }
};