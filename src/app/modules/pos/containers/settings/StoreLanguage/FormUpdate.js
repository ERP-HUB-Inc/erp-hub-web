import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/StoreLanguage/FormUpdate";

class TaxForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formUpdate: state.form.formLanguageUpdate,
    languageUpdate: state.reducer.storeLanguage.update,
    initialValues: state.reducer.storeLanguage.update.data
  };
}

const UpdateTax = reduxForm({
  form: "formLanguageUpdate",
  enableReinitialize: true
})(TaxForm);

export default connect(mapStateToProps)(UpdateTax);