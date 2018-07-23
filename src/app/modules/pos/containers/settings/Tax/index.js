import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
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
    formAdd: state.form.formTax,
    tax: state.reducer.tax,
    taxAdd: state.reducer.taxAdd
  };
}

const SelectingTax = reduxForm({
  form: "formTax"
})(Tax);

export default connect(mapStateToProps)(SelectingTax);