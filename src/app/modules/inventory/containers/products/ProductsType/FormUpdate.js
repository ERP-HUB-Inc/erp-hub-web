import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/products/ProductsType/FormUpdate";

class ProductsTypeForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTypeUpdate: state.reducer.productsType.update,
    productsType: state.reducer.productsType.request.list,
    productsTypeDetail: state.reducer.productsType.detail,
    initialValues: state.reducer.productsType.update.data,
    storeLanguage: state.reducer.storeLanguage.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const productsTypeForm = Form.create(mapPropsToFields)(ProductsTypeForm);

export default connect(mapStateToProps)(productsTypeForm);