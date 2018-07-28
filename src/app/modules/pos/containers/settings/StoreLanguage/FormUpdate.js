import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/settings/StoreLanguage/FormUpdate";

class StoreLanguageForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    languageUpdate: state.reducer.storeLanguage.update,
    initialValues: state.reducer.storeLanguage.update.data
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLanguageForm = Form.create(mapPropsToFields)(StoreLanguageForm);

export default connect(mapStateToProps)(storeLanguageForm);