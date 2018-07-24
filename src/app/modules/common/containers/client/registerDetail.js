import React from "react";
import { reduxForm } from "redux-form";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import ClientRegisterDetail from "../../components/client/registerDetail";

class RegisterDetail extends Component {
  render() {
    return (
      <ClientRegisterDetail />
    );
  }
} 

const RegisterDetailForm =  reduxForm({
  form: "clientRegisterDetail"
})(RegisterDetail);
 
export default connect ()(RegisterDetailForm);