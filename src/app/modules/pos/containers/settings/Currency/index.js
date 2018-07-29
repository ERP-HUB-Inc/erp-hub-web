import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import List from "../../../components/settings/Currency";

class Currency extends React.Component {

  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    currency: state.reducer.currency.request,
    currencyAdd: state.reducer.currency.add,
    currencyUpdate: state.reducer.currency.update
  };
}

export default connect(mapStateToProps)(Currency);