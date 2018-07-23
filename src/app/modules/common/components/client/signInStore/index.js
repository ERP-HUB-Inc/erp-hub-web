import React from "react";
import { reduxForm } from "redux-form";
import Component from "../../Component";
import "./index.css";

class SignInStore extends Component {
  render() {
    return (
      <div>
        <this.LoginLayout
          classBlogLogin="clear-padding wrap-client-login wrap-client-sign-in-store"
          clasBlogLogo="wrap-blog-signin-logo wrap-blog-logo"
        >
          <div className="title">
            <h6>Find Your store Name </h6>
          </div>
          <this.FormGroup>
            <this.Field
              name="username"
              placeholder="User name"
              type="text"
              label="Store Name"
              notation=".storevien.com"
              component={ this.InputText }
              className="ant-input"
            />
            <div className="main-signin">
              <this.Button type="info">REGISTER</this.Button>
            </div>
          </this.FormGroup>
        </this.LoginLayout>
      </div>
    );
  }
}

export default reduxForm({
  form: "signinstore"
})(SignInStore);