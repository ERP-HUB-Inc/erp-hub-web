import React from "react";
import  { connect } from "react-redux";
import Component from "../../components/Component";
import RegisterComplete from "../../components/client/registerComplete";

class ClientRegisterComplete extends Component {
  render() {
    return (
      <RegisterComplete {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    clientRegister: state.reducer.client.register
  };
}

export default connect(mapStateToProps)(ClientRegisterComplete);