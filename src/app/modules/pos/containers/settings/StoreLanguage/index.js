import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/StoreLanguage";

class Currency extends React.Component {

  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return state.reducer.storeLanguage;
}

export default connect(mapStateToProps)(Currency);