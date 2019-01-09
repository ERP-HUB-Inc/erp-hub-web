import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/StoreLocation/FormUpdate";

class TaxForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLocationUpdate: state.reducer.storeLocation.update,
    receiptTemplates: state.reducer.receiptTemplate.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const taxForm = Form.create(mapPropsToFields)(TaxForm);

export default connect(mapStateToProps)(taxForm);