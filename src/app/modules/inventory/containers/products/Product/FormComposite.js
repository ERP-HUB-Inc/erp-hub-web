import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormComposite from "../../../components/products/Product/FormComposite";

class FormCompositeForm extends React.Component {
  render() {
    return (
      <FormComposite {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    units: state.reducer.productsUnit.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formCompositeForm =  Form.create(mapPropsToFields)(FormCompositeForm);

export default connect(mapStateToProps)(formCompositeForm);