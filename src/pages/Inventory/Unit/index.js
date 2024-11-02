import React from "react";
import { connect } from "@redux/index";
import { Form } from "antd";
import UnitPage from "./components";

function UnitContainer(props) {
  return <UnitPage {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productsUnit.request,
    add: state.reducer.productsUnit.add,
    update: state.reducer.productsUnit.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const unitContainer = Form.create(mapPropsToFields)(UnitContainer);

export default connect(mapStateToProps)(unitContainer);