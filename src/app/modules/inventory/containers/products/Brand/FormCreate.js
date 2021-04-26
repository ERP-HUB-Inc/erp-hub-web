import React from "react";
import CreateProductsUnit from "../../../components/products/Brand/FormCreate";
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
    brandAdd: state.reducer.brand.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brandForm =  Form.create(mapPropsToFields)(ProductUnitForm);

export default connect(mapStateToProps)(brandForm);