import React from "react";
import Component from "../../components/Component";
import ClientSignIn from "../../components/client";

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <ClientSignIn>
          <div className="wrap-blog-logo">
            <div className="blog-logo text-center">
              <div className="inner-logo">
                <div className="logo">
                  <span className="icon-logo"></span>
                </div>
                <div className="text">
                  <strong>store</strong>Vein
                </div>
              </div>
            </div>
          </div>
          <div className="blog-login">
            <div className="header text-right">
              <div className="title"><strong>store</strong>Vein</div>
              <div className="back-office">Backoffice</div>
            </div>
            <div className="wrap-login">
              <div className="your-store-name">
                <div className="store-name">CA Store</div>
                <div className="store-url">ca.storevien.com</div>
              </div>
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
              <this.Button type="info">Sign In</this.Button>
              <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div>
            </div>
          </div> 
        </ClientSignIn>
      </div>
    );
  }
} 