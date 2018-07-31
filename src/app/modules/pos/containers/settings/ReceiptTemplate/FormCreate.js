import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/ReceiptTemplate/FormCreate";

class ReceiptTemplateForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receiptFormAdd: state.form.formReceiptTemplate,
    receiptAdd: state.reducer.receiptTemplate.add
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receiptTemplateForm =  Form.create(mapPropsToFields)(ReceiptTemplateForm);

export default connect(mapStateToProps)(receiptTemplateForm);