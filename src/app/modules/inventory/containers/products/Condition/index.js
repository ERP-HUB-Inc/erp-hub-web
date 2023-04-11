import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import ConditionList from "../../../components/products/Condition";

class Condition extends React.Component {
  render() {
    return (
      <ConditionList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.condition.request,
    add: state.reducer.condition.add,
    update: state.reducer.condition.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const condition = Form.create(mapPropsToFields)(Condition);

export default connect(mapStateToProps)(condition);