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
    list: state.reducer.receiptTemplate.request,
    add: state.reducer.receiptTemplate.add,
    update: state.reducer.receiptTemplate.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const receiptTemplate = Form.create(mapPropsToFields)(ReceiptTemplate);

export default connect(mapStateToProps)(receiptTemplate);