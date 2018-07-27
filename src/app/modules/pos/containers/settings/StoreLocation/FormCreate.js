import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/StoreLocation/FormCreate";

class StoreLanguageForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLocationFormAdd: state.form.formStoreLocation,
    storeLocationAdd: state.reducer.storeLocation.add
  };
}

const StoreLocation = reduxForm({
  form: "formStoreLocation"
})(StoreLanguageForm);

export default connect(mapStateToProps)(StoreLocation);