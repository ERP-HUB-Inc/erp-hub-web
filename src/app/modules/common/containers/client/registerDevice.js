import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import Component from "../../components/Component";
import RegisterDevice from "../../components/client/registerDevice";

class RegisterDeviceForm extends Component {
  render() {
    return (
      <RegisterDevice {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    signinDomain: state.reducer.client.signinDomain,
    update: state.reducer.device.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const registerDeviceForm = Form.create(mapPropsToFields)(RegisterDeviceForm);

export default connect(mapStateToProps)(registerDeviceForm);