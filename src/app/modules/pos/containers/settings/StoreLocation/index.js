import React from "react";
import { connect } from "react-redux";
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
    storeLocation: state.reducer.storeLocation.request,
    storeLocationAdd: state.reducer.storeLocation.add,
    storeLocationUpdate: state.reducer.storeLocation.update
  };
}

export default connect(mapStateToProps)(StoreLocation);