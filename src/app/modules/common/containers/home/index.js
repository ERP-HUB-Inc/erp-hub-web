import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import HomePage from "../../components/home";

function Dashboard(props) {
  return <HomePage {...props}/>;
}

function mapStateToProps(state) {
  const { reducer } = state;
  return {
    graphChat: reducer.homePage.listGraph,
    saleReport: reducer.saleReport.request,
    pipeChat: reducer.homePage.listChat,
    cardDashboard: reducer.homePage.listCardDashboard,
    checkPermission: reducer.privilege.checkPermission,
    locale: state.locale
  };
}
                  
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}


const dashboard = Form.create(mapPropsToFields)(Dashboard);

export default connect(mapStateToProps)(dashboard);