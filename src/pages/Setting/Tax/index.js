import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import TaxPage from "./components/index";

function TaxContainer(props) {
  return <TaxPage {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.tax.request,
    add: state.reducer.tax.add,
    update: state.reducer.tax.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const taxContainer = Form.create(mapPropsToFields)(TaxContainer);

export default connect(mapStateToProps)(taxContainer);