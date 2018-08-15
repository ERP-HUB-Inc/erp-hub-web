import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import ReceiptTemplateList from "../../../components/settings/ReceiptTemplate";

class ReceiptTemplate extends React.Component {
  render() {
    return (
      <ReceiptTemplateList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receipt: state.reducer.receiptTemplate.request,
    receiptAdd: state.reducer.receiptTemplate.add,
    receiptArchive: state.reducer.receiptTemplate.archive,
    receiptUpdate: state.reducer.receiptTemplate.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receiptTemplate = Form.create(mapPropsToFields)(ReceiptTemplate);

export default connect(mapStateToProps)(receiptTemplate);