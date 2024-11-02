import React from "react";
import {connect} from "@redux/index";
import {Form} from "antd";
import CategoryPage from "./components";

function CategoryContainer(props) {
  return <CategoryPage {...props} />;
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productsType.request,
    add: state.reducer.productsType.add,
    update: state.reducer.productsType.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const categoryContainer = Form.create(mapPropsToFields)(CategoryContainer);

export default connect(mapStateToProps)(categoryContainer);