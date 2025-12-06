import React from "react";
import { connect } from "@redux/index";
import { Form } from "antd";
import FormUpdate from "./form/form.update";

class BrandEditForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    brandUpdate: state.reducer.brand.update,
    initialValues: state.reducer.brand.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brandEditForm = Form.create(mapPropsToFields)(BrandEditForm);

export default connect(mapStateToProps)(brandEditForm);