import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/transactions/Quotation/FormUpdate";

class QuotationUpdateForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    quotationUpdate: state.reducer.quotation.update,
    initialValues: state.reducer.quotation.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const quotationUpdateForm = Form.create(mapPropsToFields)(QuotationUpdateForm);

export default connect(mapStateToProps)(quotationUpdateForm);