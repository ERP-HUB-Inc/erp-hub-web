import React from "react";
import { reduxForm } from "redux-form";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import ClientRegisterDetail from "../../components/client/registerDetail";

class RegisterDetail extends Component {
  render() {
    return (
      <ClientRegisterDetail {...this.props}/>
    );
  }
} 

const RegisterDetailForm =  reduxForm({
  form: "clientRegisterFormDetail"
})(RegisterDetail);

function mapStateToProps(state) {
  return {
    clientRegisterFormDetail: state.form.clientRegisterFormDetail,
    clientRegister: state.reducer.client.register,
    currencies: state.reducer.currencySystem.request,
    languages: state.reducer.languageSystem.request,
    businessPlans: state.reducer.businessPlan.request,
    businessTypes: state.reducer.businessType.request
  };
}
 
export default connect (mapStateToProps)(RegisterDetailForm);