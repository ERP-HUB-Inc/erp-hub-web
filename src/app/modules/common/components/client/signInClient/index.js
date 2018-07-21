import React from "react";
import { reduxForm } from "redux-form";
import Component from "../../Component";
import "./index.css";

class ClientSignIn extends Component {
  render() {
    return (
      <div>
        <this.LoginLayout>
          <this.FormGroup>
            <this.Field
              name="username"
              placeholder="User name"
              type="text"
              label="User Name"
              component={ this.AnimationInput }
              className="ant-input"
            />
          </this.FormGroup>
          <this.FormGroup>
            <this.Field
              name="password"
              placeholder="Password"
              type="password"
              label="Password"
              component={ this.AnimationInput }
              className="ant-input"
            />
          </this.FormGroup>
          <div>
            <this.Link className="store-link" to="dd">
              it's not my store
            </this.Link>
            <div className="main-signin">
              <this.Button type="info">Sign In</this.Button>
            </div>
          </div>
        </this.LoginLayout>
      </div>
    );
  }
}

export default reduxForm({
  form: "clientLogin"
})(ClientSignIn);