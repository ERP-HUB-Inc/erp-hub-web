import React from "react";
import Component from "../../Component";
import "./index.css";

export default class RegisterComplete extends Component {
  render() {
    const {clientRegister} = this.props;
    return (
      <div>{
        clientRegister.submited ? 
          <this.Row>
            <this.Col className="clear-padding wrap-client-login wrap-client-register-success">
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
                  <h6>Thank you for your starting</h6>
                </div>
                <div className="register-complete-layout">
              Please waiting for 48 hours (Working hours), we will 
              contact you back and will let you know how running your 
              business in storeVein platform.
                </div>
                <div className="register-complete-layout">
              Your contact information
                </div>
 
                <ul className="main-register-complete">
                  <li>Business Name:</li>
                  <li><b>Super Store</b></li>
                </ul>
                <ul className="main-register-complete">
                  <li>Private URL:</li>
                  <li><b>{clientRegister.response.data.storeName}.storevein.com</b></li>
                </ul>
                <ul className="main-register-complete">
                  <li>Your Full Name:</li>
                  <li><b>{`${clientRegister.response.data.firstName} ${clientRegister.response.data.lastName}`}</b></li>
                </ul>
                <ul className="main-register-complete">
                  <li>Email Address:</li>
                  <li><b>{clientRegister.response.data.email}</b></li>
                </ul>
                <ul className="main-register-complete">
                  <li>Phone Number:</li>
                  <li><b>{clientRegister.response.data.storeName}</b></li>
                </ul>
                <this.clearFloating />
                <div className="main-register-success">
                  <this.Button type="info">THANKS</this.Button>
                </div>  
              </div>
            </this.Col>
          </this.Row>
          :
          ""
      }
      </div>
    );
  }
}
