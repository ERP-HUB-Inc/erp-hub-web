import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormCreate from "../../../components/settings/StoreLanguage/FormCreate";

class StoreLanguageForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLanguageFormAdd: state.form.formStoreLanguage,
    storeLanguageAdd: state.reducer.storeLanguage.add
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLanguageForm = Form.create(mapPropsToFields)(StoreLanguageForm);

export default connect(mapStateToProps)(storeLanguageForm);