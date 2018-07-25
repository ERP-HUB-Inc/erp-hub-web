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
    storeLanguage: state.reducer.storeLanguage.request,
    storeLanguageAdd: state.reducer.storeLanguage.add,
    storeLanguageUpdate: state.reducer.storeLanguage.update
  };
}

const SelectingStoreLanguageForm = reduxForm({
  form: "formStoreLanguage"
})(StoreLanguage);

export default connect(mapStateToProps)(SelectingStoreLanguageForm);