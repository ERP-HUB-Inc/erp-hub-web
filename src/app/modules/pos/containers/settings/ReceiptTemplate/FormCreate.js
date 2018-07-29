import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormCreate from "../../../components/settings/ReceiptTemplate/FormCreate";

class StoreLanguageForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    receiptFormAdd: state.form.formReceiptTemplate,
    receiptAdd: state.reducer.receiptTemplate.add
  };
}

const StoreLocation = reduxForm({
  form: "formReceiptTemplate"
})(StoreLanguageForm);

export default connect(mapStateToProps)(StoreLocation);