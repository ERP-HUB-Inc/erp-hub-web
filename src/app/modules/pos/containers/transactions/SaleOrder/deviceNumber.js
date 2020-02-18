import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import Device from "../../../components/transactions/RetailSale/DeviceNumber";

class DeviceNumber extends React.Component {
  render() {
    return <Device {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    updateDeviceNumber: state.reducer.device.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const deviceNumber = Form.create(mapPropsToFields)(DeviceNumber);

export default connect(mapStateToProps)(deviceNumber);