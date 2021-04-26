import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import ImportProducts from "../../../components/products/ProductsUnit/importProduct";

class ImportProduct extends React.Component {
  render() {
    return (
      <ImportProducts {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const importProduct = Form.create(mapPropsToFields)(ImportProduct);

export default connect(mapStateToProps)(importProduct);