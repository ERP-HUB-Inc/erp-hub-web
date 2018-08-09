import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/ReceiptTemplate/FormUpdate";

class ReceiptTemplateUpdate extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formUpdate: state.form.formreceiptUpdate,
    receiptUpdate: state.reducer.receiptTemplate.update,
    initialValues: state.reducer.receiptTemplate.update.data
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receiptTemplateUpdate = Form.create(mapPropsToFields)(ReceiptTemplateUpdate);

export default connect(mapStateToProps)(receiptTemplateUpdate);
