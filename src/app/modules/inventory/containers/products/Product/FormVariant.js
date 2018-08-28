import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormVariant from "../../../components/products/Product/FormVariant";

class VariantForm extends React.Component {
  render() {
    return (
      <FormVariant {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const variantForm =  Form.create(mapPropsToFields)(VariantForm);

export default connect(mapStateToProps)(variantForm);