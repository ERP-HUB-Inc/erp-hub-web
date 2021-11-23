import Constant from "../constants/home";
import GraphService from "../services/GraphService";
import PipeService from "../services/PipeService";
import CardDashboardService from "../services/DashboardService";

export default {
  fetchGraph: () => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_GRAPH,
        payload: GraphService.lists()
      });
    };
  },

  fetchPipe:() => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_PIPE,
        payload: PipeService.lists()
      });
    };
  },

  fetchDashboardCard:() => {
    return dispatch => {
      return dispatch({
        type: Constant.REQUEST_CARD_DASHBOARD,
        payload: CardDashboardService.lists()
      });
    };
  }

};
