import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/StoreAccount";

class StoreAccount extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}


export default connect()(StoreAccount);