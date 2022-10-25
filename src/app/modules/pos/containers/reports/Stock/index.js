import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import StockReport from "../../../components/reports/Stock/index";

function  ReportStockContainer(props) {
  return <StockReport {...props} />;
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

const reportStockContainer =  Form.create(mapPropsToFields)(ReportStockContainer);

export default connect(mapStateToProps)(reportStockContainer);
