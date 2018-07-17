import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/RoleAccess";

class RoleAccess extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <List {...this.props} />
    );
  }
}

export default connect()(RoleAccess);