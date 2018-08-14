import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/OperationReord/FormCreate";

class OperationRecordForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    operationRecordAdd: state.reducer.operationRecord.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const operationRecordForm = Form.create(mapPropsToFields)(OperationRecordForm);

export default connect(mapStateToProps)(operationRecordForm);