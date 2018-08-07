import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import ListPrivilege from "../../../components/settings/RoleAccess/ListPrivilege";

class PrivilegeList extends React.Component {
  render() {
    return (
      <ListPrivilege {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    privileges: state.reducer.privilege.request
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const privilegeList =  Form.create(mapPropsToFields)(PrivilegeList);

export default connect(mapStateToProps)(privilegeList);