import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
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
    storeLocationAdd: state.reducer.storeLocation.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLanguageForm = Form.create(mapPropsToFields)(StoreLanguageForm);

export default connect(mapStateToProps)(storeLanguageForm);