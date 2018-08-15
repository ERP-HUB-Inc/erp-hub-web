import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
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

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLocation = Form.create(mapPropsToFields)(StoreLocation);

export default connect(mapStateToProps)(storeLocation);