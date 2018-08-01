import React from "react";
import { connect } from "react-redux";
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
    showListRole: "showListRole",
    ShowLayout: "6"
  };
}

export default connect(mapStateToProps)(RoleAccess);