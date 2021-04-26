import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/products/ProductsUnit/FormUpdate";

class ProductsUnitForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsUnitUpdate: state.reducer.productsUnit.update,
    initialValues: state.reducer.productsUnit.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsUnitForm = Form.create(mapPropsToFields)(ProductsUnitForm);

export default connect(mapStateToProps)(productsUnitForm);