import React from "react";
import Component from "../../Component";
import "./index.css";

export default class ClientRegister extends Component {
  render() {
    return (
      <this.Row>
        <this.Col className="clear-padding wrap-client-login wrap-client-register">
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
          <div className="blog-register">
            <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div>
            <div className="header text-right">
              <div className="title"><strong>store</strong>Vein</div>
              <div className="back-office">Backoffice</div>
            </div>
            <div className="title">
              <h6>Start Register with Us</h6>
            </div>
            <this.InputEmail
              name="email"
              label="Email"
              placeholder="Email"
              required={true}
            />
            <this.InputPassword
              label="Password"
              confirmLabel="Comfirm Password"
              placeholder="Password"
              confirmPlaceholder="Comfirm Password"
              required={true}
            />
            <div>
              <this.FormGroup>
                <this.Field 
                  label="Country"
                  name="language" 
                  type="radio"
                  component={ this.RadioRegisterGroup }
                >
                  <this.RadioRegister title="Global" language="England" currency="USD" value="global"/>
                  <this.RadioRegister title="Cambodia" language="Khmer" currency="KHR"  value="cambodia" />
                  <this.RadioRegister title="Myanmar" language="Burme" currency="MMX"  value="myanmar" />
                </this.Field> 
              </this.FormGroup>

              <this.Link to="/signin">
                <span className="have-acc">Have and account?</span> <span className="store-link">sign in </span>
              </this.Link>
              <div className="main-signin">
                <this.Button type="info">START</this.Button>
              </div>
            </div>
          </div>
        </this.Col>
      </this.Row>
    );
  }
}
