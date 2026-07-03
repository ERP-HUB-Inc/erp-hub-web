import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import SaleOrderPage from "../../../app/modules/pos/components/transactions/SaleOrder";

function SalesOrderContainer(props) {
  return <SaleOrderPage {...props} />;
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const salesOrderContainer =  Form.create(mapPropsToFields)(SalesOrderContainer);

export default connect(mapStateToProps)(salesOrderContainer);