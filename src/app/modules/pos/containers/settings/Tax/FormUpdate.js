import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/Tax/FormUpdate";

class TaxForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    taxUpdate: state.reducer.tax.update,
    initialValues: state.reducer.tax.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const taxForm = Form.create(mapPropsToFields)(TaxForm);

export default connect(mapStateToProps)(taxForm);