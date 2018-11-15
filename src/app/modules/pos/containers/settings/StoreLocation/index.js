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
    list: state.reducer.storeLocation.request,
    add: state.reducer.storeLocation.add,
    update: state.reducer.storeLocation.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLocation = Form.create(mapPropsToFields)(StoreLocation);

export default connect(mapStateToProps)(storeLocation);