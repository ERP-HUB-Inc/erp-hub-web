import React from "react";
import Component from "../../Component";
import "./index.css";

export default class SignInStore extends Component {
  render() {
    const {form} = this.props;
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
            <this.InputText
              name="username"
              placeholder="User name"
              type="text"
              label="Store Name"
              notation=".storevien.com"
              className="ant-input"
              form={form}
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
