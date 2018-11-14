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
    list: state.reducer.operationRecord.request,
    add: state.reducer.operationRecord.add,
    update: state.reducer.operationRecord.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const operationRecord = Form.create(mapPropsToFields)(OperationRecord);

export default connect(mapStateToProps)(operationRecord);