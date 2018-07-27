import React from "react";
import { reduxForm } from "redux-form";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import ClientRegister from "../../components/client/register";

class Register extends Component {
  render() {
    return (
      <ClientRegister {...this.props}/>
    );
  }
} 

const RegisterForm =  reduxForm({
  form: "clientRegisterFormStepOne"
})(Register);

function mapStateToProps(state) {
  return {
    clientFormRegisterFormStepOne: state.form.clientRegisterFormStepOne,
    clientRegister: state.reducer.client.register
  };
}
 
export default connect (mapStateToProps)(RegisterForm);