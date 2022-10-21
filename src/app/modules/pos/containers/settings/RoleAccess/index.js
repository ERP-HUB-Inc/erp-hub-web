import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/settings/RoleAccess";

class RoleAccess extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    roleAccess: state.reducer.roleAccess.request,
    roleAccessAdd: state.reducer.roleAccess.add,
    roleAccessArchive: state.reducer.roleAccess.archive,
    roleAccessUpdate: state.reducer.roleAccess.update,
   // rolePrivileges: state.reducer.rolePrivilege.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}


function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const roleAccess = Form.create(mapPropsToFields)(RoleAccess);

export default connect(mapStateToProps)(roleAccess);