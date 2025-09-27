import React from "react";
import { connect } from "@redux/index";
import { Form } from "antd";
import BrandPage from "./form";

function BrandContainer(props) {
  return <BrandPage {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.brand.request,
    add: state.reducer.brand.add,
    update: state.reducer.brand.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brandContainer = Form.create(mapPropsToFields)(BrandContainer);

export default connect(mapStateToProps)(brandContainer);