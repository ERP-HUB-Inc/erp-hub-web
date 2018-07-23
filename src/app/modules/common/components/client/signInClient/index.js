import React from "react";
import { reduxForm } from "redux-form";
import Component from "../../Component";
import "./index.css";

class ClientSignIn extends Component {
  render() {
    return (
      <this.LoginLayout>
        <div className="storename">Super Store</div>
        <div className="store-email">
          superstore<span className="store-email-url">.storevein.com</span>
        </div>
        <div className="main-field">
          <this.Field
            name="username"
            placeholder="User name"
            type="text"
            label="User Name"
            component={ this.InputText }
            className="ant-input"
          />
          <this.Field
            name="password"
            placeholder="Password"
            type="password"
            label="Password"
            component={ this.InputText }
            className="ant-input"
          />
          <div className="signin-button">
            <this.FormGroup>
              <this.Link className="store-link" to="dd">
              it's not my store
              </this.Link>
              <div className="main-signin">
                <this.Button type="info">Sign In</this.Button>
              </div>
            </this.FormGroup>
          </div>
        </div>
      </this.LoginLayout>
    );
  }
}

export default reduxForm({
  form: "clientLogin"
})(ClientSignIn);