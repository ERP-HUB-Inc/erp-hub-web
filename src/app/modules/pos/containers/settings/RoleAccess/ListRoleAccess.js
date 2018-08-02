import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import ListRoleAccess from "../../../components/settings/RoleAccess/ListRoleAccess";

class ListRoleAccessForm extends React.Component {
  render() {
    return (
      <ListRoleAccess {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const listRoleAccessForm =  Form.create(mapPropsToFields)(ListRoleAccessForm);

export default connect(mapStateToProps)(listRoleAccessForm);