import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import StoreLanguageList from "../../../components/settings/StoreLanguage";

class StoreLanguage extends React.Component {

  render() {
    return (
      <StoreLanguageList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.reducer.storeLanguage
  };
}

const SelectingStoreLanguageForm = reduxForm({
  form: "formStoreLanguage"
})(StoreLanguage);

export default connect(mapStateToProps)(SelectingStoreLanguageForm);