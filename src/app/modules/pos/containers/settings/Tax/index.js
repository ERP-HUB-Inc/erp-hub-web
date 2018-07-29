import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import List from "../../../components/settings/Tax";

class Tax extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    tax: state.reducer.tax.request,
    taxAdd: state.reducer.tax.add,
    taxUpdate: state.reducer.tax.update
  };
}

export default connect(mapStateToProps)(Tax);