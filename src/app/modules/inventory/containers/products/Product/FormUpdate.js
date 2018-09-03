import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/products/Product/FormUpdate";

class ProductForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productUpdate: state.reducer.product.update,
    initialValues: state.reducer.product.update.data,
    storeLanguage: state.reducer.storeLanguage.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productForm = Form.create(mapPropsToFields)(ProductForm);

export default connect(mapStateToProps)(productForm);