import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/OperationReord";

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

export default connect(mapStateToProps)(OperationRecord);