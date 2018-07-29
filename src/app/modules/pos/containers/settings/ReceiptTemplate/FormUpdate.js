import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import FormUpdate from "../../../components/settings/ReceiptTemplate/FormUpdate";

class TaxForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formUpdate: state.form.formreceiptUpdate,
    receiptUpdate: state.reducer.receiptTemplate.update,
    initialValues: state.reducer.receiptTemplate.update.data
  };
}

const UpdateTax = reduxForm({
  form: "formreceiptUpdate",
  enableReinitialize: true
})(TaxForm);

export default connect(mapStateToProps)(UpdateTax);