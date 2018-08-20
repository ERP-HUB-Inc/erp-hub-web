import React from "react";
import CreateProductsUnit from "../../../components/products/ProductsUnit/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class ProductUnitForm extends React.Component {
  render() {
    return (
      <CreateProductsUnit {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsUnitAdd: state.reducer.productsUnit.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsUnitForm =  Form.create(mapPropsToFields)(ProductUnitForm);

export default connect(mapStateToProps)(productsUnitForm);