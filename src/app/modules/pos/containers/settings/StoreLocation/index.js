import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/StoreLocation";

class StoreLocation extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <List {...this.props} />
    );
  }
}


export default connect()(StoreLocation);