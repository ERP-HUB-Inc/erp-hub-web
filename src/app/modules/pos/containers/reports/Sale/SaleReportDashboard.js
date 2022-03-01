import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import SaleReportDashboard from "../../../components/reports/Sale/SaleReportDashboard";

function  SaleReportDashboardContainer(props) {
  return <SaleReportDashboard {...props} />;
}

function mapStateToProps(state) {
  return {
    saleReport: state.reducer.saleReport.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const saleReportDashboardContainer =  Form.create(mapPropsToFields)(SaleReportDashboardContainer);

export default connect(mapStateToProps)(saleReportDashboardContainer);
