import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/settings/OperationRecord";

class OperationRecord extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    operationRecord: state.reducer.operationRecord.request,
    operationRecordAdd: state.reducer.operationRecord.add,
    operationRecordUpdate: state.reducer.operationRecord.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const operationRecord = Form.create(mapPropsToFields)(OperationRecord);

export default connect(mapStateToProps)(operationRecord);