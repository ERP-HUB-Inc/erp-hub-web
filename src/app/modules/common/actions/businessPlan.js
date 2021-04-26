import Constant from "../constants/businessPlan";
import BusinessPlanService from "../services/BusinessPlanService";

export function fetchAllBusinessPlanSystem() {
  return dispatch => {
    return dispatch({
      type: Constant.REQUEST_BUSINESS_PLAN,
      payload: BusinessPlanService.findSystemRecord()
    });
  };
}
