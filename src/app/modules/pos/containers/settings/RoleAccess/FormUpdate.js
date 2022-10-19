import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/RoleAccess/FormUpdate";

class RoleAccessForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    roleAccessUpdate: state.reducer.roleAccess.update,
    roleAccessDetail: state.reducer.roleAccess.detail,
    rolePrivileges: state.reducer.rolePrivilege.request,
    privileges: state.reducer.privilege.request,
    rowData: state.reducer.roleAccess.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const roleAccessForm = Form.create(mapPropsToFields)(RoleAccessForm);

export default connect(mapStateToProps)(roleAccessForm);