import React from "react";
import { Form } from "antd";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import SignInClient from "../../components/client/signInClient";

class SignInClientForm extends Component {
  render() {
    return (
      <SignInClient {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    signinUser: state.reducer.client.signin,
    signinDomain: state.reducer.client.signinDomain
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const signInClientForm = Form.create(mapPropsToFields)(SignInClientForm);

export default connect(mapStateToProps)(signInClientForm);