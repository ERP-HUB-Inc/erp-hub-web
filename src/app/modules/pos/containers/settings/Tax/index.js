import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/Tax";

class Tax extends React.Component {

  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return state.reducer.tax;
}

export default connect(mapStateToProps)(Tax);