import React from "react";
import  {connect} from "react-redux";
import {Form} from "antd";
import Component from "../../components/Component";
import ClientRegister from "../../components/client/register";

class Register extends Component {
  render() {
    return (
      <ClientRegister {...this.props}/>
    );
  }
} 

function mapStateToProps(state) {
  return {
    clientRegister: state.reducer.client.register,
    clientCheckExisting: state.reducer.client.checkExist
  };
}
 
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const register = Form.create(mapPropsToFields)(Register);

export default connect(mapStateToProps)(register);