import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import ReportLowSales from "../../../components/reports/Sale/ReportLowSales";

function  ReportLowSalesContainer(props) {
  return <ReportLowSales {...props} />;
}

function mapStateToProps(state) {
  return {
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reportLowSalesContainer =  Form.create(mapPropsToFields)(ReportLowSalesContainer);

export default connect(mapStateToProps)(reportLowSalesContainer);
