import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/ReceiptTemplate";

class ReceiptTemplate extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

export default connect()(ReceiptTemplate);