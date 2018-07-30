import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import Component from "../../components/Component";
import SignInStore from "../../components/client/signInStore";

class SignInStoreForm extends Component {
  render() {
    return (
      <SignInStore {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    response: state.reducer.client.signinDomain
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const signInStoreForm = Form.create(mapPropsToFields)(SignInStoreForm);

export default connect(mapStateToProps)(signInStoreForm);