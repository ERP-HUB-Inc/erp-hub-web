import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import StoreLocationList from "../../../components/settings/StoreLocation";

class StoreLocation extends React.Component {
  render() {
    return (
      <StoreLocationList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    formAdd: state.form.formStoreLocation,
    storeLocation: state.reducer.storeLocation,
    storeLocationAdd: state.reducer.storeLocationAdd,
    storeLocationUpdate: state.reducer.storeLocationUpdate
  };
}

const SelectingStoreLocation = reduxForm({
  form: "formStoreLocation"
})(StoreLocation);

export default connect(mapStateToProps)(SelectingStoreLocation);