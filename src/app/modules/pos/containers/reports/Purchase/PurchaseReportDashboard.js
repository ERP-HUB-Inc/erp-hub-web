import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import PurchaseReportDashboard from "../../../components/reports/Purchase/PurchaseReportDashboard";

function  PurchaseReportDashboardContainer(props) {
  return <PurchaseReportDashboard {...props} />;
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

const purchaseReportDashboardContainer =  Form.create(mapPropsToFields)(PurchaseReportDashboardContainer);

export default connect(mapStateToProps)(purchaseReportDashboardContainer);
