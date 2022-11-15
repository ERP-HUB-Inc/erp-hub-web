import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import StockConsignment from "../../../components/stock/StockConsignment";

function StockConsignmentContainer(props) {
  return <StockConsignment {...props} />;
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

const stockConsignmentContainer = Form.create(mapPropsToFields)(StockConsignmentContainer);

export default connect(mapStateToProps)(stockConsignmentContainer);