import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
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
    receiptUpdate: state.reducer.receiptTemplate.update,
    initialValues: state.reducer.receiptTemplate.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receiptTemplateUpdate = Form.create(mapPropsToFields)(ReceiptTemplateUpdate);

export default connect(mapStateToProps)(receiptTemplateUpdate);
