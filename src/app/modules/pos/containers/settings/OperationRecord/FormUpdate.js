import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/OperationReord/FormUpdate";

class OperationRecordForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    operationRecordUpdate: state.reducer.operationRecord.update,
    initialValues: state.reducer.operationRecord.update.data
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const operationRecordForm = Form.create(mapPropsToFields)(OperationRecordForm);

export default connect(mapStateToProps)(operationRecordForm);