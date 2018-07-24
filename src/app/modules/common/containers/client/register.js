import React from "react";
import { reduxForm } from "redux-form";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import ClientRegister from "../../components/client/register";

class SignIn extends Component {
  render() {
    return (
      <ClientRegister />
    );
  }
} 

const RegisterForm =  reduxForm({
  form: "clientLogin"
})(SignIn);
 
export default connect ()(RegisterForm);