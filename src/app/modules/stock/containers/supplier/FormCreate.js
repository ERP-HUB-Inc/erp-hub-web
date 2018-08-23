import React from "react";
import CreateProductsUnit from "../../components/supplier/FormCreate";
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
    supplierAdd: state.reducer.supplier.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierForm =  Form.create(mapPropsToFields)(ProductUnitForm);

export default connect(mapStateToProps)(supplierForm);