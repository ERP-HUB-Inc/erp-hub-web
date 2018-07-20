import React from "react";
import { reduxForm } from "redux-form";
import Component from "../Component";
import "./index.css";

class ClientSignIn extends Component {
  render() {
    return (
      <this.Row>
        <this.Col className="clear-padding wrap-client-login">
          { this.props.children }
        </this.Col>
      </this.Row>
    );
  }
}

export default reduxForm({
  form: "clientLogin"
})(ClientSignIn);