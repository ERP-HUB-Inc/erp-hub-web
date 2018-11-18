import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/products/ProductsTag/FormUpdate";

class ManagementEmployeeForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTagUpdate: state.reducer.productsTag.update,
    initialValues: state.reducer.productsTag.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const managementEmployeeForm = Form.create(mapPropsToFields)(ManagementEmployeeForm);

export default connect(mapStateToProps)(managementEmployeeForm);